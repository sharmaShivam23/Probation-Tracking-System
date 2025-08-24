import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Attendance from "@/models/Attendance";
import Candidate from "@/models/Candidate";
import jwt from "jsonwebtoken";

function normalizeDateToUTC(dateStr: string) {
  // dateStr expected in "YYYY-MM-DD" (from input type=date)
  const d = new Date(dateStr + "T00:00:00.000Z");
  return d;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    // 🔹 1. Extract token from header
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // 🔹 2. Verify token
    let decoded: { id: string; role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    // 🔹 3. Check role (only admins allowed)
    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Only admins can mark attendance" },
        { status: 403 }
      );
    }

    // 🔹 4. Parse body
    const body = await req.json();
    const { candidateId, date, status } = body as {
      candidateId?: string;
      date?: string;
      status?: "Present" | "Absent";
    };

    if (!candidateId || !date || !status) {
      return NextResponse.json(
        { success: false, message: "candidateId, date and status are required" },
        { status: 400 }
      );
    }

    // 🔹 5. Validate candidate exists
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ success: false, message: "Candidate not found" }, { status: 404 });
    }

    const normalized = normalizeDateToUTC(date);

    // 🔹 6. Upsert attendance
    const updated = await Attendance.findOneAndUpdate(
      { candidate: candidateId, date: normalized },
      { candidate: candidateId, date: normalized, status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, attendance: updated }, { status: 201 });
  } catch (error: unknown) {
    console.error("Attendance mark error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
