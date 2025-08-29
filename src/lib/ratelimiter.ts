import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Global rate limiter for general API endpoints
export const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
  analytics: true,
  prefix: "global",
});

// Strict rate limiter for authentication endpoints
export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 requests per 15 minutes
  analytics: true,
  prefix: "auth",
});

// Registration-specific rate limiter (more restrictive)
export const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"), // 3 requests per hour
  analytics: true,
  prefix: "registration",
});

// Admin registration rate limiter (very restrictive)
export const adminRegistrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "24 h"), // 2 requests per day
  analytics: true,
  prefix: "admin_registration",
});

// Helper function to get client identifier
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  // Try to get the real IP from various headers
  const ip = cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown";

  // For additional security, you can combine IP with user agent
  const userAgent = req.headers.get("user-agent") || "unknown";

  return `${ip}:${userAgent}`;
}

// Rate limiter middleware function
export async function rateLimitMiddleware(
  req: Request,
  limiter: Ratelimit,
  identifier?: string
) {
  const clientId = identifier || getClientIdentifier(req);

  try {
    const { success, limit, reset, remaining } = await limiter.limit(clientId);

    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000);
      return {
        success: false,
        limit,
        remaining,
        reset,
        retryAfter,
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`
      };
    }

    return {
      success: true,
      limit,
      remaining,
      reset
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    // In case of Redis failure, allow the request but log the error
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
      error: "Rate limiting temporarily unavailable"
    };
  }
}

// Higher-order function to wrap API handlers with rate limiting
export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiter: Ratelimit,
  customIdentifier?: (req: NextRequest) => string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Apply rate limiting
    const identifier = customIdentifier ? customIdentifier(req) : undefined;
    const rateLimitResult = await rateLimitMiddleware(req, limiter, identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': rateLimitResult.retryAfter?.toString() || '3600'
          }
        }
      );
    }

    // Add rate limit headers to successful responses
    const response = await handler(req);
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', rateLimitResult.reset.toString());

    return response;
  };
}
