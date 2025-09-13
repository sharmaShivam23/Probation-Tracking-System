import Candidate from "@/models/Candidate";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectDB();
//     const users = await Candidate.find().sort({ createdAt: -1 });
//     return NextResponse.json({ success: true, users });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
//   }
// }

import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  id: string;
  role: string;
  name: string;
  email: string;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const users = await Candidate.find({}, "name rollNo branch role createdAt")
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, users });
  } catch (error: unknown) {
    console.error("Fetch users error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
