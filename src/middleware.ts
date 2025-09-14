// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import * as jose from "jose";


// const allowedOrigins = [
//   "http://localhost:3000",           
//   "https://probation-tracking-system.vercel.app", 
// ];

// export async function middleware(req: NextRequest) {
//   const origin = req.headers.get("origin") || "";

//   if (allowedOrigins.includes(origin)) {
//     const res = NextResponse.next();

//     res.headers.set("Access-Control-Allow-Origin", origin);
//     res.headers.set(
//       "Access-Control-Allow-Methods",
//       "GET, POST, PUT, DELETE, OPTIONS"
//     );
//     res.headers.set(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization"
//     );

//     if (req.method === "OPTIONS") {
//       return new NextResponse(null, { status: 204, headers: res.headers });
//     }
//   } else {
  
//     if (req.method === "OPTIONS") {
//       return new NextResponse("CORS origin denied", { status: 403 });
//     }
//   }

//   // Auth & role verification
//   const token = req.cookies.get("auth_token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jose.jwtVerify(token, secret);

//     const role = (payload.role as string)?.toLowerCase();
//     const pathname = req.nextUrl.pathname;

//     // console.log("Decoded role:", role, " Path:", pathname);

//     if (pathname.startsWith("/student-dashboard")) {
//       if (role !== "student") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     } else if (pathname.startsWith("/admin-dashboard")) {
//       if (role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     return NextResponse.next();
//   } catch (err) {
//     // console.error("JWT verification failed:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/admin-dashboard/:path*",
//     "/admin-dashboard",
//     "/student-dashboard/:path*",
//     "/student-dashboard",
//     "/api/:path*",
//   ],
// };



import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const allowedOrigins = [
  "http://localhost:2000",
  "https://probation-tracking-system.vercel.app",
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const pathname = req.nextUrl.pathname;
  const isAPI = pathname.startsWith("/api");

  // --- ✅ CORS Handling ---
  if (allowedOrigins.includes(origin)) {
    const corsHeaders = new Headers();
    corsHeaders.set("Access-Control-Allow-Origin", origin);
    corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // Allow OPTIONS preflight requests (important for API)
    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: corsHeaders });
    }

    // For other requests, attach CORS headers
    const res = NextResponse.next();
    corsHeaders.forEach((value, key) => res.headers.set(key, value));

    // If it's an API route, we only apply CORS (no auth check)
    if (isAPI) return res;

    // For dashboard pages, continue to auth check below
    return await handleAuth(req, res);
  }

  // --- ❌ If origin not allowed ---
  if (req.method === "OPTIONS") {
    return new NextResponse("CORS origin denied", { status: 403 });
  }

  // If no CORS issue but it's an API, just continue
  if (isAPI) return NextResponse.next();

  // Otherwise, check authentication for dashboards
  return await handleAuth(req, NextResponse.next());
}

async function handleAuth(req: NextRequest, res: NextResponse) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const role = (payload.role as string)?.toLowerCase();
    const pathname = req.nextUrl.pathname;

    // Role-based protection
    if (pathname.startsWith("/student-dashboard") && role !== "student") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
    if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    return res;
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/admin-dashboard",
    "/student-dashboard/:path*",
    "/student-dashboard",
    "/api/:path*", 
  ],
};
