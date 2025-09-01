import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const user = await Candidate.findById(id).populate("uploadedTasks");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, tasks: user.uploadedTasks, user });
  } catch (error: unknown) {
    console.error("Fetch user error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
