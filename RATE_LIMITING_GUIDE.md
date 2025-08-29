# Production-Ready Rate Limiting Guide

This guide explains how to implement and use the production-ready rate limiting system in your Next.js API routes.

## Overview

The rate limiting system uses Upstash Redis for distributed rate limiting across multiple server instances. It provides multiple rate limiters for different use cases and includes proper error handling and fallback mechanisms.

## Available Rate Limiters

### 1. Global Limiter
- **Rate**: 10 requests per minute
- **Use Case**: General API endpoints
- **Prefix**: `global`

### 2. Auth Limiter
- **Rate**: 5 requests per 15 minutes
- **Use Case**: Authentication endpoints (login, logout)
- **Prefix**: `auth`

### 3. Registration Limiter
- **Rate**: 3 requests per hour
- **Use Case**: User registration endpoints
- **Prefix**: `registration`

### 4. Admin Registration Limiter
- **Rate**: 2 requests per day
- **Use Case**: Admin registration endpoints (very restrictive)
- **Prefix**: `admin_registration`

## Implementation Methods

### Method 1: Manual Implementation (Recommended for complex logic)

```typescript
import { NextResponse } from "next/server";
import { adminRegistrationLimiter, rateLimitMiddleware } from "@/lib/ratelimiter";

export async function POST(req: Request) {
  try {
    // Apply rate limiting first
    const rateLimitResult = await rateLimitMiddleware(req, adminRegistrationLimiter);
    
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

    // Your existing logic here...
    
  } catch (error) {
    // Error handling...
  }
}
```

### Method 2: Higher-Order Function (Recommended for simple routes)

```typescript
import { NextResponse, NextRequest } from "next/server";
import { withRateLimit, registrationLimiter } from "@/lib/ratelimiter";

async function yourHandler(req: NextRequest) {
  // Your existing logic here...
  return NextResponse.json({ success: true });
}

// Export the rate-limited version
export const POST = withRateLimit(yourHandler, registrationLimiter);
```

### Method 3: Custom Identifier

For cases where you want to rate limit based on specific criteria (e.g., email, user ID):

```typescript
import { withRateLimit, authLimiter } from "@/lib/ratelimiter";

async function loginHandler(req: NextRequest) {
  const body = await req.json();
  const { email } = body;
  
  // Your login logic here...
}

// Rate limit by email instead of IP
export const POST = withRateLimit(
  loginHandler, 
  authLimiter,
  (req: NextRequest) => {
    // Extract email from request body for rate limiting
    // Note: This is a simplified example - you'd need to parse the body
    return "email-based-identifier";
  }
);
```

## Response Headers

The rate limiting system automatically adds the following headers to responses:

- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: Timestamp when the rate limit resets
- `Retry-After`: Seconds to wait before retrying (for 429 responses)

## Error Handling

The system includes robust error handling:

1. **Redis Failure**: If Redis is unavailable, requests are allowed but errors are logged
2. **Invalid Headers**: Graceful fallback to "unknown" identifier
3. **Rate Limit Exceeded**: Returns 429 status with proper retry information

## Environment Variables

Ensure these environment variables are set:

```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

## Best Practices

### 1. Choose Appropriate Limiters
- Use `adminRegistrationLimiter` for admin registration (very restrictive)
- Use `registrationLimiter` for user registration
- Use `authLimiter` for login/logout endpoints
- Use `globalLimiter` for general API endpoints

### 2. Client Identification
The system automatically identifies clients using:
1. Cloudflare IP (`cf-connecting-ip`)
2. Real IP (`x-real-ip`)
3. Forwarded IP (`x-forwarded-for`)
4. User agent (for additional uniqueness)

### 3. Monitoring
- All rate limiting events are logged to console
- Use Upstash Redis analytics for detailed monitoring
- Monitor 429 responses in your application logs

### 4. Security Considerations
- Rate limits are per-client (IP + User Agent)
- Consider implementing additional security measures for sensitive endpoints
- Monitor for abuse patterns and adjust limits accordingly

## Example Implementations

### Admin Registration (Current Implementation)
```typescript
// Uses adminRegistrationLimiter (2 requests per day)
// Manual implementation for maximum control
```

### User Registration (Current Implementation)
```typescript
// Uses registrationLimiter (3 requests per hour)
// Higher-order function for cleaner code
```

### Login Endpoint (Recommended)
```typescript
import { withRateLimit, authLimiter } from "@/lib/ratelimiter";

async function loginHandler(req: NextRequest) {
  // Your login logic here...
}

export const POST = withRateLimit(loginHandler, authLimiter);
```

## Troubleshooting

### Common Issues

1. **Redis Connection Errors**
   - Check environment variables
   - Verify Upstash Redis service status
   - Check network connectivity

2. **Rate Limits Too Strict/Loose**
   - Adjust limits in `ratelimiter.ts`
   - Monitor usage patterns
   - Consider different limits for different environments

3. **Headers Not Showing**
   - Ensure using NextRequest instead of Request
   - Check that rate limiting is applied before other logic

### Debugging

Enable detailed logging by adding:

```typescript
console.log('Rate limit result:', rateLimitResult);
```

## Performance Considerations

- Rate limiting adds minimal overhead (~1-5ms per request)
- Redis operations are fast and cached
- System gracefully degrades if Redis is unavailable
- Consider using connection pooling for high-traffic applications

## Scaling

The system is designed to scale across multiple server instances:
- Redis provides distributed rate limiting
- No local state dependencies
- Consistent behavior across all instances
- Automatic cleanup of expired rate limit data 