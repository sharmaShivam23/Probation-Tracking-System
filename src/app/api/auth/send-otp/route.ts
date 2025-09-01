import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mailSender from "@/components/mailSender";
import schemaOTP from "@/models/otpStore";
import { connectDB } from "@/lib/db";
import { withRateLimit, globalLimiter } from "@/lib/ratelimiter";

// Your actual handler
async function sendOtpHandler(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { email , rollNo } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    if (!rollNo) {
      return NextResponse.json(
        { success: false, message: "Student number is required" },
        { status: 400 }
      );
    }

    const emailRegex = /^[a-z]{3,15}(24|23)\d{5,6}@akgec\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid Email" },
        { status: 400 }
      );
    }

        const rollReg = /^(24|23)\d{5,6}$/;
        if (!rollReg.test(rollNo)) {
          return NextResponse.json(
            { success: false, message: "Invalid Student Number" },
            { status: 400 }
          );
        }

        if(!email.includes(rollNo)){
               return NextResponse.json(
            { success: false, message: "Email , Student number mismatch" },
            { status: 400 }
          );
        }

    const otp = Math.floor(10000 + Math.random() * 90000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await schemaOTP.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Load template
    const templatePath = path.join(
      process.cwd(),
      "src",
      "templates",
      "otpTemplate.html"
    );
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json(
        { success: false, message: "OTP template not found" },
        { status: 500 }
      );
    }

    let otpTemplate = fs.readFileSync(templatePath, "utf8");
    otpTemplate = otpTemplate
      .replace("{{otp}}", otp)
      .replace("{{year}}", new Date().getFullYear().toString())
      .replace("{{ctaLink}}", "https://yourapp.com/verify");

    await mailSender(email, "Verify OTP", otpTemplate);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error("Error in send-otp:", error);
    return NextResponse.json(
      { success: false, message: "Error sending OTP" },
      { status: 500 }
    );
  }
}


export const POST = withRateLimit(sendOtpHandler, globalLimiter);

