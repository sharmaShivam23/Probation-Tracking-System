// // src/app/api/attendance/my/route.ts
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Attendance from "@/models/Attendance";
// import { verifyToken } from "../../middlewares/middleware";

// export async function GET(req: Request) {
//   await connectDB();

//   try {
//     // ✅ Get token from request header
//     const authHeader = req.headers.get("authorization");
//     if (!authHeader?.startsWith("Bearer ")) {
//       return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
//     }

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyToken(token);
//     if (!decoded) {
//       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 403 });
//     }

//     // ✅ Fetch attendance for logged in user only
//     const attendance = await Attendance.find({ candidate: decoded.id }).sort({ date: -1 });

//     return NextResponse.json({ success: true, attendance });
//   } catch (error) {
//     console.error("Attendance fetch error:", error);
//     return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
//   }
// }

// src/app/api/attendance/my/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";

export async function POST(req: Request) {
  await connectDB();

  try {
  
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    const attendance = await Attendance.find({ candidate: userId }).sort({ date: -1 });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
