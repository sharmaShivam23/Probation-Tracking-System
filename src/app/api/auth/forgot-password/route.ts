import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Admin from "@/models/Admins";
import Candidate from "@/models/Candidate";
import fs from "fs";
import path from "path";
import mailSender from "@/components/mailSender";
import { withRateLimit, globalLimiter } from "@/lib/ratelimiter";

const emailRegex = /^[a-z]{3,15}(24|23)\d{5,6}@akgec\.ac\.in$/;

async function forgotpassword(request: NextRequest) {
  try {
    await connectDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: "Invalid AKGEC Email Format" }, { status: 400 });
    }

    const user =
      (await Admin.findOne({ email })) || (await Candidate.findOne({ email }));

    if (!user) {
      return NextResponse.json({ success: false, message: "Email not registered" }, { status: 404 });
    }

  
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    const tokenExpiry = Date.now() + 5 * 60 * 1000; 

    // Save token
    user.passwordToken = hashedToken;
    user.passwordTokenExpiry = tokenExpiry;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL ?? "https://tasksphere25.vercel.app"}/updatepassword/${rawToken}`;

    const templatePath = path.join(process.cwd(), "src", "templates", "forgotpassword.html");
    if (!fs.existsSync(templatePath)) {
      return NextResponse.json({ success: false, message: "Email template not found" }, { status: 500 });
    }

    let htmlTemplate = fs.readFileSync(templatePath, "utf8");
    htmlTemplate = htmlTemplate
      .replace(/{{resetLink}}/g, resetLink)
      .replace(/{{year}}/g, new Date().getFullYear().toString());

    await mailSender(email, "Reset Password - TaskSphere", htmlTemplate);

    return NextResponse.json({
      success: true,
      message: "Password reset email sent successfully. Link valid for 5 minutes.",
    });
  } catch (error) {
    console.error("Error generating reset token:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


export const POST = withRateLimit(forgotpassword, globalLimiter);