
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";
import UplodedTask from "@/models/UplodedTasks";
import { verifyToken } from "@/lib/verifyToken";

export async function POST() {
  await connectDB();

  try {
    const { valid, user, error } = await verifyToken();

    if (!valid || !user?.userId) {
      return NextResponse.json(
        { success: false, message: error || "Unauthorized" },
        { status: 401 }
      );
    }

    
    await UplodedTask.findOne();

    const candidate = await Candidate.findById(user?.userId).populate("uploadedTasks");

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      tasks: candidate.uploadedTasks,
      user: candidate,
    });
  } catch (error: unknown) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}