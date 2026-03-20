



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";
import { addSecurityHeaders } from "@/lib/securityMiddleware";

const allowedOrigins = [
  "http://localhost:3000",
  // "https://probation-tracking-system.vercel.app",
  "https://tasksphere25.vercel.app",
  "https://main.d26arhhgrnp3xa.amplifyapp.com"
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const pathname = req.nextUrl.pathname;
  const isAPI = pathname.startsWith("/api");

  // For API routes, enforce CORS strictly
  if (isAPI) {
    // If there's an origin header (cross-origin request), check if it's allowed
    if (origin) {
      if (!allowedOrigins.includes(origin)) {
        // Block unauthorized origins
        if (req.method === "OPTIONS") {
          return new NextResponse("CORS origin not allowed", { status: 403 });
        }
        return NextResponse.json(
          { success: false, message: "CORS origin not allowed" },
          { status: 403 }
        );
      }
    }
    // If no origin header, it's a same-origin request (allowed)

    // Setup CORS headers only for allowed origins
    const corsHeaders = new Headers();
    if (origin && allowedOrigins.includes(origin)) {
      corsHeaders.set("Access-Control-Allow-Origin", origin);
    }
    corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    corsHeaders.set("Access-Control-Allow-Credentials", "true");

    // Handle preflight (OPTIONS) requests
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // For other API requests, attach CORS headers and security headers
    const res = NextResponse.next();
    corsHeaders.forEach((value, key) => res.headers.set(key, value));
    return addSecurityHeaders(res);
  }

  // --- Dashboard routes: check auth token ---
  if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/admin-dashboard")) {
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jose.jwtVerify(token, secret);

      const role = (payload.role as string)?.toLowerCase();
      if (pathname.startsWith("/student-dashboard") && role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
      if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }

      // Setup CORS headers for dashboard routes (if origin is allowed)
      const corsHeaders = new Headers();
      if (origin && allowedOrigins.includes(origin)) {
        corsHeaders.set("Access-Control-Allow-Origin", origin);
      }
      corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      corsHeaders.set("Access-Control-Allow-Credentials", "true");

      const res = NextResponse.next();
      corsHeaders.forEach((value, key) => res.headers.set(key, value));
      return addSecurityHeaders(res);
    } catch (err) {
      console.error("JWT Verification Failed:", err);
      const redirectResponse = NextResponse.redirect(new URL("/login", req.url));
      return addSecurityHeaders(redirectResponse);
    }
  }

  // --- Default (other pages) - allow with CORS if origin is allowed ---
  const corsHeaders = new Headers();
  if (origin && allowedOrigins.includes(origin)) {
    corsHeaders.set("Access-Control-Allow-Origin", origin);
  }
  corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const res = NextResponse.next();
  corsHeaders.forEach((value, key) => res.headers.set(key, value));
  return addSecurityHeaders(res);
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin-dashboard/:path*",
    "/admin-dashboard",
    "/student-dashboard/:path*",
    "/student-dashboard",
  ],
};







// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import * as jose from "jose";

// const allowedOrigins = [
//   "http://localhost:2000",
//   "https://probation-tracking-system.vercel.app",
// ];

// export async function middleware(req: NextRequest) {
//   const origin = req.headers.get("origin") || "";
//   const pathname = req.nextUrl.pathname;
//   const isAPI = pathname.startsWith("/api");

//   // Setup CORS headers
//   const corsHeaders = new Headers();
//   if (allowedOrigins.includes(origin)) {
//     corsHeaders.set("Access-Control-Allow-Origin", origin);
//   }
//   corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   //  Handle OPTIONS preflight (important for browser requests)
//   if (req.method === "OPTIONS") {
//     return new NextResponse(null, { status: 204, headers: corsHeaders });
//   }

//   //  If this is an API route, just attach CORS headers and continue
//   if (isAPI) {
//     const res = NextResponse.next();
//     corsHeaders.forEach((value, key) => res.headers.set(key, value));
//     return res;
//   }

//   //  If this is a dashboard route, check auth token
//   if (pathname.startsWith("/student-dashboard") || pathname.startsWith("/admin-dashboard")) {
//     const token = req.cookies.get("auth_token")?.value;
//     if (!token) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     try {
//       const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//       const { payload } = await jose.jwtVerify(token, secret);

//       const role = (payload.role as string)?.toLowerCase();
//       if (pathname.startsWith("/student-dashboard") && role !== "student") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//       if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }

//       console.log("Origin header:", origin, "Method:", req.method, "Path:", pathname);
// console.log("ENV SECRET_CODE:", process.env.SECRET_CODE);


//       const res = NextResponse.next();
//       corsHeaders.forEach((value, key) => res.headers.set(key, value));
//       return res;
//     } catch (err) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//   }

//   //  Default: just attach CORS headers for other pages
//   const res = NextResponse.next();
//   corsHeaders.forEach((value, key) => res.headers.set(key, value));
//   return res;
// }

// export const config = {
//   matcher: [
//     "/api/:path*",
//     "/admin-dashboard/:path*",
//     "/admin-dashboard",
//     "/student-dashboard/:path*",
//     "/student-dashboard",
//   ],
// };
