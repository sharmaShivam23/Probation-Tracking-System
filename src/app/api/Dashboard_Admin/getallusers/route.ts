import Candidate from "@/models/Candidate";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    await connectDB();
    const users = await Candidate.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}