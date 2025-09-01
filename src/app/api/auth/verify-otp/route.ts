import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import schemaOTP from "@/models/otpStore";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Find the OTP record for this email
    const otpRecord = await schemaOTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: "No OTP found for this email" },
        { status: 400 }
      );
    }

    // Check if OTP has expired (5 minutes)
    const now = new Date();
    const otpTime = new Date(otpRecord.createdAt);
    const timeDiff = now.getTime() - otpTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);

    if (minutesDiff > 5) {
      // Delete expired OTP
      await schemaOTP.deleteOne({ email });
      return NextResponse.json(
        { success: false, message: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return NextResponse.json(
        { success: false, message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Delete the OTP after successful verification
    await schemaOTP.deleteOne({ email });

    return NextResponse.json(
      { success: true, message: "OTP verified successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
} 