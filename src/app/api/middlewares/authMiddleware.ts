// // src/lib/auth.ts
// import jwt from "jsonwebtoken";

// export interface MyJwtPayload {
//   id: string;
//   email: string;
//   role: string;
//   branch?: string;
//   domain?: string;
// }

// export function verifyToken(token: string): MyJwtPayload | null {
//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;
//   } catch (error) {
//     return null;
//   }
// }
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";


const ADMIN_ONLY_PATHS = ["/admin/attendance", "/admin/upload-tasks"];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;


  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };

    const pathname = req.nextUrl.pathname;

    // If user tries to access admin-only route but role is not admin
    if (ADMIN_ONLY_PATHS.some(path => pathname.startsWith(path)) && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/not-authorized", req.url));
    }

    // Allow request
    return NextResponse.next();

  } catch {
    // Invalid/expired token
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only to these routes
export const config = {
  matcher: ["/admin/:path*", "/student/:path*"], 
};
