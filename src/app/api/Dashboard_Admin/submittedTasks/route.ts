


// import { connectDB } from "@/lib/db";
// import UploadedTask from "@/models/UplodedTasks";
// import { NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// interface DecodedToken {
//   id: string;
//   role: string;
// }

// export async function GET(req: Request) {
//   try {
//     await connectDB();

    
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json(
//         { success: false, message: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     let decoded: DecodedToken;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
//     } catch {
//       return NextResponse.json(
//         { success: false, message: "Invalid token" },
//         { status: 401 }
//       );
//     }

    
//     if (decoded.role !== "Admin") {
//       return NextResponse.json(
//         { success: false, message: "Forbidden: Admins only" },
//         { status: 403 }
//       );
//     }

    
//     const Submittedtasks  = await UploadedTask.find()
//       .populate({
//         path: "uploadedBy",
//         select: "name email rollNo  domain -_id",
//       })
//       .sort({ createdAt: -1 })
//       .limit(100); 

//     return NextResponse.json({ success: true, Submittedtasks  });
//   } catch (error: unknown) {
//     console.error("Fetch submitted tasks error:", error);
//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";
//     return NextResponse.json(
//       { success: false, message: errorMessage },
//       { status: 500 }
//     );
//   }
// }


import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import Candidate from "@/models/Candidate";  
import { NextResponse } from "next/server";
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
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: DecodedToken;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden: Admins only" },
        { status: 403 }
      );
    }

    const Submittedtasks = await UploadedTask.find()
      .populate({
        path: "uploadedBy",
        select: "name email rollNo domain -_id",
      })
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json({ success: true, Submittedtasks });
  } catch (error: unknown) {
    console.error("Fetch submitted tasks error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
