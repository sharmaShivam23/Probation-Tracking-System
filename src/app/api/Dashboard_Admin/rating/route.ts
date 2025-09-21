import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import Candidate from "@/models/Candidate"; 
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

export async function POST(req: Request) {
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
        { success: false, message: "Forbidden: Only Admins can rate tasks" },
        { status: 403 }
      );
    }

    const { taskId, rating } = await req.json();

    if (!taskId || rating === undefined) {
      return NextResponse.json(
        { success: false, message: "taskId and rating are required" },
        { status: 400 }
      );
    }

    if (rating < 0 || rating > 10) {
      return NextResponse.json(
        { success: false, message: "Rating must be between 0 and 10" },
        { status: 400 }
      );
    }

    const updatedTask = await UploadedTask.findByIdAndUpdate(
      taskId,
      { rating },
      { new: true }
    ).populate({
      path: "uploadedBy",
      select: "name email rollNo domain -_id",
    });

    if (!updatedTask) {
      return NextResponse.json(
        { success: false, message: "Task not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Rating updated successfully",
      updatedTask,
    });
  } catch (error: unknown) {
    console.error("Error rating task:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
