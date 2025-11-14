import { NextRequest, NextResponse } from "next/server";

/**
 * Sanitize string to prevent XSS attacks (for display purposes only)
 * Note: This HTML-encodes strings, so don't use for data validation
 */
function sanitizeStringForDisplay(input: string): string {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "") // Remove < and >
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers like onclick=
}

/**
 * Sanitize string to prevent injection attacks (for data processing)
 * This removes dangerous patterns without HTML encoding
 */
function sanitizeStringForData(input: string): string {
  if (typeof input !== "string") return input;

  // Only remove dangerous patterns, don't HTML encode
  return input
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, ""); // Remove event handlers
}

/**
 * Sanitize object recursively to prevent injection attacks
 * Uses data sanitization (not HTML encoding) for programmatic use
 */
function sanitizeObjectForData(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "string") {
    return sanitizeStringForData(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObjectForData(item));
  }

  if (typeof obj === "object") {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Prevent MongoDB operator injection in keys
        const sanitizedKey = key.replace(/^\$/, ""); // Remove $ prefix
        sanitized[sanitizedKey] = sanitizeObjectForData(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}

/**
 * Prevent HTTP Parameter Pollution (HPP)
 * Takes the first value if multiple values exist
 */
function preventHPP(query: URLSearchParams): Record<string, string> {
  const params: Record<string, string> = {};

  for (const [key, value] of query.entries()) {
    // Take only the first value to prevent HPP
    if (!params[key]) {
      params[key] = value;
    }
  }

  return params;
}

/**
 * MongoDB sanitization - remove dangerous operators from object keys only
 * Preserves string values (like emails) but blocks MongoDB operator injection
 */
function mongoSanitize(data: any): any {
  if (data === null || data === undefined) return data;

  // Don't modify string values - they're safe as-is for queries
  if (typeof data === "string") {
    return data; // Keep strings intact (emails, names, etc.)
  }

  if (Array.isArray(data)) {
    return data.map(item => mongoSanitize(item));
  }

  if (typeof data === "object") {
    const sanitized: any = {};
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        // Block MongoDB operators in keys only
        if (key.startsWith("$")) {
          continue; // Skip dangerous operators like $gt, $ne, etc.
        }
        sanitized[key] = mongoSanitize(data[key]);
      }
    }
    return sanitized;
  }

  return data;
}

/**
 * Add security headers (Helmet-like functionality)
 */
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // XSS Protection
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Prevent MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevent clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // Referrer Policy
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Content Security Policy (adjust as needed)
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'"
  );

  // Permissions Policy
  response.headers.set(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );

  // Strict Transport Security (only in production)
  if (process.env.NODE_ENV === "production") {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  return response;
}

/**
 * Sanitize request body and query parameters
 */
export function sanitizeRequest(req: NextRequest): {
  sanitizedBody?: any;
  sanitizedQuery: Record<string, string>;
} {
  const url = new URL(req.url);
  const query = preventHPP(url.searchParams);
  const sanitizedQuery = sanitizeObjectForData(query) as Record<string, string>;

  return {
    sanitizedQuery,
  };
}

/**
 * Sanitize request body for MongoDB injection prevention
 * Only sanitizes object structure, preserves string values (emails, etc.)
 */
export function sanitizeRequestBody(body: any): any {
  if (!body) return body;

  // First sanitize for basic injection patterns (without HTML encoding)
  const dataSanitized = sanitizeObjectForData(body);

  // Then sanitize for MongoDB operator injection in object keys
  return mongoSanitize(dataSanitized);
}

/**
 * Security middleware wrapper for API routes
 * This can be combined with rate limiting
 */
export function withSecurity(
  handler: (req: NextRequest, sanitizedBody?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Sanitize query parameters
      const { sanitizedQuery } = sanitizeRequest(req);

      // Sanitize request body if it exists
      let sanitizedBody: any = undefined;

      if (req.method !== "GET" && req.method !== "HEAD") {
        try {
          // Clone the request to read body without consuming it
          const clonedReq = req.clone();
          const body = await clonedReq.json().catch(() => null);
          if (body) {
            sanitizedBody = sanitizeRequestBody(body);
          }
        } catch {
          // Body might not be JSON or might be empty
          sanitizedBody = undefined;
        }
      }

      // Create a new request with sanitized body if needed
      // For Next.js, we'll pass sanitized body to handler
      const response = await handler(req, sanitizedBody);

      // Add security headers
      return addSecurityHeaders(response);
    } catch (error) {
      console.error("Security middleware error:", error);
      return NextResponse.json(
        { success: false, message: "Security validation failed" },
        { status: 400 }
      );
    }
  };
}

/**
 * Helper to read and sanitize request body
 * Use this in your route handlers when you need sanitized body
 * Note: This consumes the request body, so use it once per request
 */
export async function getSanitizedBody(req: NextRequest): Promise<any> {
  try {
    // Check if body has already been read
    const body = await req.json().catch(() => null);
    if (body) {
      return sanitizeRequestBody(body);
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Sanitize a body object directly (when body is already parsed)
 */
export function sanitizeBody(body: any): any {
  if (!body) return body;
  return sanitizeRequestBody(body);
}

/**
 * Sanitize query parameters from URL
 */
export function sanitizeQueryParams(req: NextRequest): Record<string, string> {
  const url = new URL(req.url);
  const query = preventHPP(url.searchParams);
  return sanitizeObjectForData(query) as Record<string, string>;
}

