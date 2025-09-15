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
//     // "/api/:path*",
//   ],
// };



// // import { NextResponse } from "next/server";
// // import type { NextRequest } from "next/server";
// // import * as jose from "jose";

// // const allowedOrigins = [
// //   "http://localhost:3000",
// //   "https://probation-tracking-system.vercel.app",
// // ];

// // export async function middleware(req: NextRequest) {
// //   const origin = req.headers.get("origin") || "";
// //   const pathname = req.nextUrl.pathname;
// //   const isAPI = pathname.startsWith("/api");

// //   // Check if origin is allowed
// //   if (allowedOrigins.includes(origin)) {
// //     const corsHeaders = new Headers();
// //     corsHeaders.set("Access-Control-Allow-Origin", origin);
// //     corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
// //     corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

// //     // Allow OPTIONS preflight requests (important for API)
// //     if (req.method === "OPTIONS") {
// //       return new NextResponse(null, { status: 204, headers: corsHeaders });
// //     }

// //     // For other requests, attach CORS headers
// //     const res = NextResponse.next();
// //     corsHeaders.forEach((value, key) => res.headers.set(key, value));

// //     // If it's an API route, we only apply CORS (no auth check)
// //     if (isAPI) return res;

// //     // For dashboard pages, continue to auth check below
// //     return await handleAuth(req, res);
// //   }

// //   // --- ❌ If origin not allowed, block the request ---
// //   if (req.method === "OPTIONS") {
// //     return new NextResponse("CORS origin denied", { status: 403 });
// //   }

// //   // Block all requests from unauthorized origins
// //   return new NextResponse("CORS origin not allowed", { status: 403 });
// // }

// // async function handleAuth(req: NextRequest, res: NextResponse) {
// //   const token = req.cookies.get("auth_token")?.value;

// //   if (!token) {
// //     return NextResponse.redirect(new URL("/login", req.url));
// //   }

// //   try {
// //     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
// //     const { payload } = await jose.jwtVerify(token, secret);
// //     const role = (payload.role as string)?.toLowerCase();
// //     const pathname = req.nextUrl.pathname;

// //     // Role-based protection
// //     if (pathname.startsWith("/student-dashboard") && role !== "student") {
// //       return NextResponse.redirect(new URL("/unauthorized", req.url));
// //     }
// //     if (pathname.startsWith("/admin-dashboard") && role !== "admin") {
// //       return NextResponse.redirect(new URL("/unauthorized", req.url));
// //     }

// //     return res;
// //   } catch (err) {
// //     return NextResponse.redirect(new URL("/login", req.url));
// //   }
// // }

// // export const config = {
// //   matcher: [
// //     "/admin-dashboard/:path*",
// //     "/admin-dashboard",
// //     "/student-dashboard/:path*",
// //     "/student-dashboard",
// //     "/api/:path*",
// //   ],
// // };




import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const allowedOrigins = [
  "http://localhost:2000",
  // "https://probation-tracking-system.vercel.app",
  "https://tasksphere25.vercel.app"
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";
  const pathname = req.nextUrl.pathname;
  const isAPI = pathname.startsWith("/api");

  // --- Setup CORS headers ---
  const corsHeaders = new Headers();
  if (allowedOrigins.includes(origin)) {
    corsHeaders.set("Access-Control-Allow-Origin", origin);
  }
  corsHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  corsHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Handle preflight (OPTIONS) ---
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // --- API routes: attach CORS only ---
  if (isAPI) {
    const res = NextResponse.next();
    corsHeaders.forEach((value, key) => res.headers.set(key, value));
    return res;
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

      // Debug logs (only on dashboard pages)
      // console.log("✅ Middleware Pass | Origin:", origin || "none", "| Path:", pathname);
      // console.log("🔑 ENV SECRET_CODE:", process.env.SECRET_CODE);

      const res = NextResponse.next();
      corsHeaders.forEach((value, key) => res.headers.set(key, value));
      return res;
    } catch (err) {
      console.error("JWT Verification Failed:", err);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // --- Default (other pages) ---
  const res = NextResponse.next();
  corsHeaders.forEach((value, key) => res.headers.set(key, value));
  return res;
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
