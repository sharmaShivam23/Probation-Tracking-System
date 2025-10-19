import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admins";
import Candidate from "@/models/Candidate";
import mailSender from "@/components/mailSender";
import { withRateLimit, globalLimiter } from "@/lib/ratelimiter";

async function resetpassword(request: NextRequest) {
  try {
    await connectDB();

    const { password, confirmPassword, hashedToken } = await request.json();

    if (!password || !confirmPassword || !hashedToken) {
      return NextResponse.json(
        { success: false, message: "password, confirmPassword, and token are required" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ success: false, message: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }


    const tokenHash = crypto.createHash("sha256").update(hashedToken).digest("hex");
    const now = Date.now();


    const user =
      (await Admin.findOne({ passwordToken: tokenHash, passwordTokenExpiry: { $gt: now } })) ||
      (await Candidate.findOne({ passwordToken: tokenHash, passwordTokenExpiry: { $gt: now } }));

    if (!user) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 400 });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword;
    user.passwordToken = undefined;
    user.passwordTokenExpiry = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();


    try {
      const html = `
        <p>Your password has been successfully changed. If you didn’t do this, please contact support immediately.</p>
        <p>You can now <a href="${process.env.CLIENT_URL ?? "https://tasksphere25.vercel.app"}">login</a> with your new password.</p>
      `;
      await mailSender(user.email, "Password Changed - TaskSphere", html);
    } catch (mailErr) {
      console.warn("Password reset succeeded but email failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful. Please login with your new password.",
    });
  } catch (err) {
    console.error("Error in reset password:", err);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


export const POST = withRateLimit(resetpassword, globalLimiter);