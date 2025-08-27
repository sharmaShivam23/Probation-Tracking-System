
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import Candidate from "@/models/Candidate";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email, rollNo, branch, github, password, role, domain } = body;


    if (!name || !email || !rollNo || !branch || !github || !password || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    let nameReg = /^[A-Za-z ]+$/;
    if (!nameReg.test(name)) {
      return NextResponse.json(
        { success: false, message: "Invalid Name" },
        { status: 400 }
      );
    }

   let emailRegex = /^[a-z]{3,15}24\d{5,6}@akgec\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Invalid Email" },
        { status: 400 }
      );
    }

    let rollReg = /^24\d{5,6}$/;
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

        if(!github.startsWith("https://github.com")){
          return NextResponse.json(
            { success: false, message: "Invalid Github Id" },
            { status: 400 }
          );
        }

    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+?])[A-Za-z\d!@#$%^&*()_+?]{7,}$/;
    if (!passReg.test(password)) {
      return NextResponse.json(
        { success: false, message: "Password must contain at least 7 characters with uppercase, lowercase, number, and special character" },
        { status: 400 }
      );
    }

    if(role !== "Student"){
      return NextResponse.json( { success: false, message: "Invalid User Role" },
        { status: 400 })
    }

    const existing = await Candidate.findOne({ $or: [{ email }, { rollNo }] });
    if (existing) {
      return NextResponse.json(
        { success: false, message: "Candidate already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newCandidate = new Candidate({
      name,
      email,
      rollNo,
      branch,
      github,
      password: hashedPassword,
      role,
      domain: domain || "Other",
    });

    await newCandidate.save();

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
