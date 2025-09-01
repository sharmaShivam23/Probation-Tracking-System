import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});


export const globalLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(10, "1 m"), 
  analytics: true,
  prefix: "global",
});



export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5 , "15 m"), 
  analytics: true,
  prefix: "auth",
});


export const registrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "15 m"), 
  analytics: true,
  prefix: "registration",
});


export const adminRegistrationLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, "24 h"), 
  analytics: true,
  prefix: "admin_registration",
});


export function getClientIdentifier(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfConnectingIp = req.headers.get("cf-connecting-ip");

  const ip = cfConnectingIp || realIp || forwarded?.split(",")[0] || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";

  return `${ip}:${userAgent}`;
}

export async function rateLimitMiddleware(
  req: NextRequest,
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
        message: `Rate limit exceeded. Try again in ${retryAfter} seconds.`,
      };
    }

    return {
      success: true,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("Rate limiting error:", error);
    return {
      success: true, 
      limit: 0,
      remaining: 0,
      reset: 0,
      error: "Rate limiting temporarily unavailable",
    };
  }
}


export function withRateLimit(
  handler: (req: NextRequest) => Promise<NextResponse>,
  limiter: Ratelimit,
  customIdentifier?: (req: NextRequest) => string
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const identifier = customIdentifier ? customIdentifier(req) : undefined;
    const rateLimitResult = await rateLimitMiddleware(req, limiter, identifier);

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: rateLimitResult.message,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
            "Retry-After": rateLimitResult.retryAfter?.toString() || "60",
          },
        }
      );
    }

    const response = await handler(req);

    
    const res = NextResponse.next({
      request: {
        headers: req.headers,
      },
    });
    Object.entries(response.headers).forEach(([key, value]) =>
      res.headers.set(key, value)
    );

    res.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
    res.headers.set(
      "X-RateLimit-Remaining",
      rateLimitResult.remaining.toString()
    );
    res.headers.set("X-RateLimit-Reset", rateLimitResult.reset.toString());

    return response;
  };
}
