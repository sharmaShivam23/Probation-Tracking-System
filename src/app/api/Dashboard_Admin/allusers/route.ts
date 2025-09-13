import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Candidate from "@/models/Candidate";
import Admin from "@/models/Admins";
import jwt from "jsonwebtoken";

interface DecodedToken {
  id: string;
  role: string;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Forbidden: Admins only" }, { status: 403 });
    }

  
    const students = await Candidate.find({ role: "Student" })
      .select("name email rollNo domain probationStatus github createdAt uploadedTasks").sort({ name: 1 }) 
      .lean();

    const sanitizedStudents = students.map((student) => ({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      domain: student.domain,
      probationStatus: student.probationStatus,
      github: student.github,
      joined: student.createdAt,
      uploadedTasksCount: student.uploadedTasks?.length || 0,
    }));

    
    const admins = await Admin.find()
      .select("name email domain uploadedTasks").sort({ name: 1 }) 
      .lean();

    const sanitizedAdmins = admins.map((admin) => ({
      name: admin.name,
      email: admin.email,
      domain: admin.domain,
      uploadedTasksCount: admin.uploadedTasks?.length || 0,
    }));

    return NextResponse.json({ success: true, students: sanitizedStudents, admins: sanitizedAdmins });
  } catch (error: unknown) {
    console.error("Fetch users error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
