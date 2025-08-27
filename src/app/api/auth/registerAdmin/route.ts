import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import Admin from "@/models/Admins";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, rollNo, branch, password, role, code } = body;


    if (!name || !email || !rollNo || !branch || !password || !role || !code) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Name validation
    let nameReg = /^[A-Za-z ]+$/;
    if (!nameReg.test(name)) {
      return NextResponse.json(
        { success: false, message: "Invalid Name" },
        { status: 400 }
      );
    }

    // Email validation for admin (must contain 23 batch year)
       let emailRegex = /^[a-z]{3,15}23\d{5,6}@akgec\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid Email Id" },
        { status: 400 }
      );
    }

    // Roll number validation for admin (must start with 23)
    let rollReg = /^23\d{5,6}$/;
    if (!rollReg.test(rollNo)) {
      return NextResponse.json(
        { success: false, message: "Invalid Student Number" },
        { status: 400 }
      );
    }

    if(!email.includes(rollNo)){
      return NextResponse.json(
        { success: false, message: "Email and student number not match" },
        { status: 400 }
      );
    }

    if(role !== "Admin"){
      return NextResponse.json( { success: false, message: "Invalid User Role" },
        { status: 400 })
    }

    // Password validation
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/;
    if (!passReg.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least 7 characters with uppercase, lowercase, number, and special character" },
        { status: 400 }
      );
    }

    if (code !== process.env.CODE) {
      return NextResponse.json(
        { success: false, message: "You are not Admin" },
        { status: 400 }
      )
    }


    const existing = await Admin.findOne({ $or: [{ email }, { rollNo }] });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Admin already registered" },
        { status: 400 }
      );
    }


    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedCode = await bcrypt.hash(code, 10);


    const newAdmin = new Admin({
      name,
      email,
      rollNo,
      branch,
      role,
      password: hashedPassword,
      code: hashedCode
    });

    await newAdmin.save();

    return NextResponse.json(
      { success: true, message: "Registered successfully" },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Server Error';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
