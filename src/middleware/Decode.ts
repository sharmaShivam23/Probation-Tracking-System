// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// "use client";
// import { jwtDecode } from "jwt-decode";  // ✅ correct import


// interface JwtPayload {
//   role?: string;
//   exp?: number;
// }

// export function middleware(req: NextRequest) {
//   // get token from cookies
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     // decode token
//     const decoded = jwtDecode<JwtPayload>(token);

//     // check expiration
//     if (decoded.exp && Date.now() >= decoded.exp * 1000) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // check role (example: only admin allowed on /admin routes)
//     if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "admin") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//     // check role (example: only student allowed on /student routes)
//     if (req.nextUrl.pathname.startsWith("/student") && decoded.role !== "student") {
//       return NextResponse.redirect(new URL("/dashboard", req.url));
//     }

//   } catch (error) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   return NextResponse.next();
// }

// // apply middleware only on these routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/student/:path*"],
// };


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode"; // ✅ works on edge

interface JwtPayload {
  role?: string;
  exp?: number;
}

export function middleware(req: NextRequest) {
  // get token from cookies (must match name from login API)
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // decode token
    const decoded = jwtDecode<JwtPayload>(token);

    // check expiration
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const url = req.nextUrl.clone();

    // role-based redirects
    if (url.pathname.startsWith("/Admin") && decoded.role !== "admin") {
      url.pathname = "/student"; // redirect student to student dashboard
      return NextResponse.redirect(url);
    }

    if (url.pathname.startsWith("/student") && decoded.role !== "student") {
      url.pathname = "/admin"; // redirect admin to admin dashboard
      return NextResponse.redirect(url);
    }

    // ✅ Allow access
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// apply middleware only on these routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/student/:path*"],
};
