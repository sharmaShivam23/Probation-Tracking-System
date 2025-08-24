// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import * as jose from "jose";

// export async function middleware(req: NextRequest) {
//   const token = req.cookies.get("auth_token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
//     const { payload } = await jose.jwtVerify(token, secret);

//     const role = (payload.role as string)?.toLowerCase();
//     const pathname = req.nextUrl.pathname;

//     console.log("Decoded role:", role, " Path:", pathname);

//     if (pathname.startsWith("/Dashboard")) {
//       if (role !== "admin") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     if (pathname.startsWith("/Dashboard-Students")) {
//       if (role !== "student") {
//         return NextResponse.redirect(new URL("/unauthorized", req.url));
//       }
//     }

//     return NextResponse.next();
//   } catch (err) {
//     console.error("JWT verification failed:", err);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/Dashboard/:path*", "/Dashboard", "/Dashboard-Students/:path*", "/Dashboard-Students"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    const role = (payload.role as string)?.toLowerCase();
    const pathname = req.nextUrl.pathname;

    console.log("Decoded role:", role, " Path:", pathname);

    // ✅ Check student dashboard first
    if (pathname.startsWith("/Dashboard-Students")) {
      if (role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    // ✅ Then check admin dashboard
    else if (pathname.startsWith("/Dashboard")) {
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: [
    "/Dashboard/:path*",
    "/Dashboard",
    "/Dashboard-Students/:path*",
    "/Dashboard-Students",
  ],
};
