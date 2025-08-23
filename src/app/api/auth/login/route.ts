// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import bcrypt from "bcryptjs";
// import Candidate from "@/models/Candidate";
// import Admin from "@/models/Admins";
// import jwt from "jsonwebtoken";

// export async function POST(req: Request) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { email, password } = body;

  
//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, message: "All fields are required" },
//         { status: 400 }
//       );
//     }

  
//     let existing = await Candidate.findOne({ email });
//     let role = "Student";
//     console.log("check");
    

//     if (!existing) {
//       existing = await Admin.findOne({ email });
//        console.log("checksf");
//       role = "Admin";
//     }

//     if (!existing) {
//       return NextResponse.json(
//         { success: false, message: "You are not registered" },
//         { status: 400 }
//       );
//     }

//     const isPasswordValid = await bcrypt.compare(password, existing.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { success: false, message: "Invalid password" },
//         { status: 400 }
//       );
//     }

//     // JWT payload
//     const payload = {
//       id: existing._id,
//       email: existing.email,
//       role : existing.role,
//       branch : existing.branch,
//       domain : existing.domain
//     };

//     // Generate JWT token
//     const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "3h" });


//     const response = NextResponse.json(
//       { success: true, message: "Login successful", token  , payload },
//       { status: 200 }
//     );

    
//     response.cookies.set({
//       name: "auth_token",
//       value: token,
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "Strict",
//       maxAge: 3 * 60 * 60,
//     });
    

//     return response;
//   } catch (error: any) {
//     console.error("Login error:", error);
//     return NextResponse.json(
//       { success: false, message: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs";
import Candidate from "@/models/Candidate";
import Admin from "@/models/Admins";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
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

  
    const isPasswordValid = await bcrypt.compare(password, existing.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

  
    const payload = {
      id: existing._id,
      email: existing.email,
      role: existing.role,
      branch: existing.branch,
      domain: existing.domain,
    };

    
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "3h" });

    
    const response = NextResponse.json(
      { success: true, token , payload,  message: "Login successful" },
      { status: 200 }
    );

    response.cookies.set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 60 * 60, 
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
