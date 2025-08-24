


import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    const Submittedtasks = await UploadedTask.find().populate("uploadedBy").sort({ createdAt: -1 });

    return NextResponse.json({ success: true, Submittedtasks });
  } catch (error: unknown) {
    console.log(error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
