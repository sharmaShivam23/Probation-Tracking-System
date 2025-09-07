
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req: Request) {
  await connectDB();
 

  try {
     const { valid, user, error } = await verifyToken();
  
      if (!valid || !user?.userId) {
        return NextResponse.json(
          { success: false, message: error || "Unauthorized" },
          { status: 401 }
        );
      }
    const attendance = await Attendance.find({ candidate: user?.userId }).sort({ date: -1 });

    return NextResponse.json({ success: true, attendance });
  } catch (error) {
    console.error("Attendance fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
