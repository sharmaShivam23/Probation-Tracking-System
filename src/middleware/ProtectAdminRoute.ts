// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // get JWT from cookies

  // if no token -> redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;

    // check role for protected routes
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/admin")) {
      if (decoded.role !== "Admin") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    if (pathname.startsWith("/student")) {
      if (decoded.role !== "Student") {
        return NextResponse.redirect(new URL("/unauthorized", req.url));
      }
    }

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Routes where middleware will run
export const config = {
  matcher: ["/admin/:path*", "/student/:path*"], // protect both admin and student routes
};
