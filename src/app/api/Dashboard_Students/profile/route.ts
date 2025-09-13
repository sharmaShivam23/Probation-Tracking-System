import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";
import Candidate from "@/models/Candidate";
import UploadedTask from "@/models/UplodedTasks";
import { verifyToken } from "@/lib/verifyToken";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export async function GET() {
  await connectDB();

  try {
    const { valid, user, error } = await verifyToken();

    if (!valid || !user?.userId) {
      return NextResponse.json(
        { success: false, message: error || "Unauthorized" },
        { status: 401 }
      );
    }

    const candidate = await Candidate.findById(user.userId)

    if (!candidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      candidate,
    });

  } catch (err: any) {
    console.error("GET profile error:", err?.message || err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}


export async function PUT(req: Request) {
  await connectDB();

  try {
    const { valid, user, error } = await verifyToken();
    if (!valid || !user?.userId) {
      return NextResponse.json({ success: false, message: error || "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const allowedUpdates = ["name", "github", "domain"];
    const updateData: Record<string, any> = {};

    allowedUpdates.forEach((field) => {
      if (body[field]) updateData[field] = body[field];
    });

    const candidate = await Candidate.findByIdAndUpdate(
      user.userId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!candidate) {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedCandidate: candidate });

  } catch (err: any) {
    console.error("PUT profile error:", err?.message || err);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}



export async function DELETE(req: Request) {
  await connectDB();

  try {

    const { valid, user, error } = await verifyToken();

    if (!valid || !user?.userId) {
      return NextResponse.json(
        { success: false, message: error || "Unauthorized" },
        { status: 401 }
      );
    }

    const { password } = await req.json();
    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }


    const existingCandidate = await Candidate.findById(user.userId);
    if (!existingCandidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 }
      );
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingCandidate.password
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    // Delete all uploaded tasks by this candidate
    // await UploadedTask.deleteMany({ uploadedBy: user.userId });

    // Delete candidate
    await Candidate.findByIdAndDelete(user.userId);

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (err: any) {
    console.error("DELETE profile error:", err?.message || err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
