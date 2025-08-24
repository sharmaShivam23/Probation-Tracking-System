import Candidate from "@/models/Candidate";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const users = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}