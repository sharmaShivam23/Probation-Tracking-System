// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Candidate from "@/models/Candidate";
// import Attendance from "@/models/Attendance";

// export async function GET() {
//   try {
//     await connectDB();
//     const candidates = await Candidate.find({ role: "Student" }).select("name rollNo branch").collation({ locale: "en", strength: 1 }) 
//       .sort({ name: 1 }); 

   
//     const result = await Promise.all(
//       candidates.map(async (c) => {
//         const totalCount = await Attendance.countDocuments({ candidate: c._id });
//         const presentCount = await Attendance.countDocuments({ candidate: c._id, status: "Present" });
//         const percentage = totalCount === 0 ? 0 : Math.round((presentCount / totalCount) * 100);
//         return {
//           id: c._id,
//           name: c.name,
//           rollNo: c.rollNo,
//           branch: c.branch,
//           attendance: {
//             total: totalCount,
//             present: presentCount,
//             percentage,
//           },
//         };
//       })
//     );

//     return NextResponse.json({ success: true, students: result }, { status: 200 });
//   } catch (error: unknown) {
//     console.error("Fetch students attendance error:", error);
//     const errorMessage = error instanceof Error ? error.message : 'Server error';
//     return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Candidate from "@/models/Candidate";
import Attendance from "@/models/Attendance";

export async function GET() {
  try {
    await connectDB();

  
    const candidates = await Candidate.find({ role: "Student" })
      .select("name rollNo branch")
      .collation({ locale: "en", strength: 1 })
      .sort({ name: 1 });

  
    const attendanceStats = await Attendance.aggregate([
      {
        $group: {
          _id: "$candidate",
          total: { $sum: 1 },
          present: {
            $sum: {
              $cond: [{ $eq: ["$status", "Present"] }, 1, 0],
            },
          },
        },
      },
    ]);

    
    const attendanceMap: Record<
      string,
      { total: number; present: number; percentage: number }
    > = {};
    attendanceStats.forEach((stat) => {
      attendanceMap[stat._id.toString()] = {
        total: stat.total,
        present: stat.present,
        percentage: stat.total === 0 ? 0 : Math.round((stat.present / stat.total) * 100),
      };
    });

  
    const result = candidates.map((c) => {
      const stats = attendanceMap[c._id.toString()] || {
        total: 0,
        present: 0,
        percentage: 0,
      };
      return {
        id: c._id,
        name: c.name,
        rollNo: c.rollNo,
        branch: c.branch,
        attendance: stats,
      };
    });

    return NextResponse.json({ success: true, students: result }, { status: 200 });
  } catch (error: unknown) {
    console.error("Fetch students attendance error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}
