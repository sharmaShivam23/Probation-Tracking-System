// // middleware.ts
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get("token")?.value;

//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//     // Role-based guard
//     if (req.nextUrl.pathname.startsWith("/admin") && decoded.role !== "Admin") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//     if (req.nextUrl.pathname.startsWith("/student") && decoded.role !== "Student") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }
//     if (req.nextUrl.pathname.startsWith("/instructor") && decoded.role !== "Instructor") {
//       return NextResponse.redirect(new URL("/unauthorized", req.url));
//     }

//     return NextResponse.next();
//   } catch (err) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/admin/:path*", "/student/:path*", "/instructor/:path*"], // protect routes
// };


// export function verifyToken(req: Request) {
//   const token =
//     req.headers.get("Authorization")?.replace("Bearer ", "").trim() ||
//     "";

//   if (!token) throw new Error("Token missing");

//   try {
//     return jwt.verify(token, process.env.JWT_SECRET!);
//   } catch {
//     throw new Error("Invalid token");
//   }
// }


// export async function GET(req: Request) {
//   try {
//     const user: any = verifyToken(req);

//     if (user.role !== "Admin") {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.json({ success: true, message: "Welcome Admin!" });
//   } catch (err: any) {
//     return NextResponse.json({ success: false, message: err.message }, { status: 401 });
//   }
// }