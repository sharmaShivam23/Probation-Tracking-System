
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import Candidate from "@/models/Candidate";
import Admin from "@/models/Admins";
import jwt from "jsonwebtoken";
import { registrationLimiter , withRateLimit } from "@/lib/ratelimiter";

 async function Login(request: Request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All details are required" },
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

    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/
    if (!passReg.test(password)) {
      return NextResponse.json(
        { success: false, message: "Invalid Password" },
        { status: 400 }
      );
    }

    


    let existing = await Candidate.findOne({ email });
    if (!existing) existing = await Admin.findOne({ email });

    if (!existing) {
      return NextResponse.json(
        { success: false, message: "You are not registered" },
        { status: 400 }
      );
    }

    if (existing.probationStatus === "inactive") {
    return NextResponse.json({
      success: false,
      status : 403,
      message: "Your account is inactive. Please contact the admin.",
    });
  }


    const isPasswordValid = await bcrypt.compare(password, existing.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }


    const payload = {
      id: existing._id,
      name: existing.name,
      email: existing.email,
      role: existing.role,
      branch: existing.branch,
      domain: existing.domain,
    };


    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { success: false, message: "Server misconfiguration: JWT secret missing" },
        { status: 500 }
      );
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "50m" });


    const response = NextResponse.json(
      { success: true, token, message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 50 * 60 ,
      // maxAge: 50 * 60 ,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(Login, registrationLimiter);
