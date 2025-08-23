// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import Candidate from "@/models/Candidate";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { name, email, rollNo, branch, github , password , role } = body;

//     if (!name || !email || !rollNo || !branch || !github || !password || !role) {
//       return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
//     }

//     // check duplicate email or rollNo
//     const existing = await Candidate.findOne({ $or: [{ email }, { rollNo }] });
//     if (existing) {
//       return NextResponse.json({ success: false, message: "Candidate already registered" }, { status: 400 });
//     }
   
//      const hashedPassword = await bcrypt.hash(password, 10);

//     const newCandidate = new Candidate({ name, email, rollNo, branch, github , password : hashedPassword });
//     await newCandidate.save();

//     return NextResponse.json({ success: true, message: "Registered successfully" }, { status: 201 });
//   } catch (error: any) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


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


    const emailRegex = /^[a-zA-Z0-9._%+-]+@akgec\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Email must end with @akgec.ac.in" },
        { status: 400 }
      );
    }
    if (!rollNo.startsWith("24")) {
      return NextResponse.json(
        { success: false, message: "Roll number must start with 24" },
        { status: 400 }
      );
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
      domain: domain || "other",
    });

    await newCandidate.save();

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
