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

    if(code !== process.env.code){
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
      code : hashedCode
    });

    await newAdmin.save();

    return NextResponse.json(
      { success: true, message: "Registered successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
