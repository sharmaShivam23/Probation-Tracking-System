import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Candidate from "@/models/Candidate";
import Attendance from "@/models/Attendance";

function startOfDayUTC(date: Date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

export async function GET(req: Request) {
  try {
    await connectDB();

    // fetch all students (you might want to filter only role: "Student")
    const candidates = await Candidate.find({ role: "Student" }).select("name rollNo branch");

    // For each candidate compute presentCount & totalCount -> percentage
    // (for better perf, you can use aggregation pipeline; below is straightforward)
    const result = await Promise.all(
      candidates.map(async (c) => {
        const totalCount = await Attendance.countDocuments({ candidate: c._id });
        const presentCount = await Attendance.countDocuments({ candidate: c._id, status: "Present" });
        const percentage = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);
        return {
          id: c._id,
          name: c.name,
          rollNo: c.rollNo,
          branch: c.branch,
          attendance: {
            total: totalCount,
            present: presentCount,
            percentage,
          },
        };
      })
    );

    return NextResponse.json({ success: true, students: result }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch students attendance error:", error);
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
