import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const allowedOrigins = [
  "http://localhost:3000",           
  "https://probation-tracking-system.vercel.app", 
];

export async function middleware(req: NextRequest) {
  const origin = req.headers.get("origin") || "";

  if (allowedOrigins.includes(origin)) {
    const res = NextResponse.next();

    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
      return new NextResponse(null, { status: 204, headers: res.headers });
    }
  } else {
  
    if (req.method === "OPTIONS") {
      return new NextResponse("CORS origin denied", { status: 403 });
    }
  }

  // Auth & role verification
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

    if (pathname.startsWith("/student-dashboard")) {
      if (role !== "student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    } else if (pathname.startsWith("/admin-dashboard")) {
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
    "/admin-dashboard/:path*",
    "/admin-dashboard",
    "/student-dashboard/:path*",
    "/student-dashboard",
    "/api/:path*",
  ],
};
