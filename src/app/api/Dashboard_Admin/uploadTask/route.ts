

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Taskss";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Admin from "@/models/Admins";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    let decoded: { id: string; role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
    } catch {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Only admin can upload tasks" }, { status: 403 });
    }
    const formData = await req.formData();
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const link = formData.get("link") as string;
    const deadline = formData.get("deadline") as string;
    const file = formData.get("file") as File | null;
  

    if (!title || !description || !deadline || !category) {
      return NextResponse.json(
        { success: false, message: "Title, description, category, and deadline are required" },
        { status: 400 }
      );
    }



  if (!/^[a-zA-Z0-9 ]+$/.test(title)) {
  return NextResponse.json(
    { success: false, message: "Title can only contain alphabets, numbers, and spaces" },
    { status: 400 }
  );
}

if (!/^[a-zA-Z0-9 ]+$/.test(description)) {
  return NextResponse.json(
    { success: false, message: "Description can only contain alphabets, numbers, and spaces" },
    { status: 400 }
  );
}


if(link){
    if (
  !/^https?:\/\/(drive\.google\.com)\/(file\/d\/|open\?id=|uc\?id=|drive\/folders\/)[a-zA-Z0-9_-]+/.test(link)
) {
  return NextResponse.json(
    { success: false, message: "Invalid Google Drive link" },
    { status: 400 }
  );
}
}

if (!code) {
  return NextResponse.json(
    { success: false, message: "Security code is required" },
    { status: 400 }
  );
}

if(code !== process.env.NEXT_PUBLIC_SECURITY_CODE_fILE){
    return NextResponse.json(
    { success: false, message: "Invalid Security Code" },
    { status: 400 }
  );
}



  
    let fileUrl: string | null = null;
    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes: { secure_url: string } = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "tasks", resource_type: "raw" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result as { secure_url: string });
          }
        );
        stream.end(buffer);
      });

      fileUrl = uploadRes.secure_url;
    }

    
    const task = await Task.create({
      title,
      description,
      link,
      category,
      deadline: new Date(deadline),
      file: fileUrl,
      uploadedBy: decoded.id,
    });

    await Admin.findByIdAndUpdate(decoded.id, { $push: { uploadedTasks: task._id } });

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error uploading task:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectDB();

    // const tasks = (await Task.find().populate("uploadedBy")).sort({ createdAt: -1 }); 
    const tasks = await Task.find()
      .populate("uploadedBy")
      .sort({ createdAt: -1 });


    return NextResponse.json({ success: true, tasks });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Task from "@/models/Taskss";
// import jwt from "jsonwebtoken";
// import { v2 as cloudinary } from "cloudinary";
// import Admin from "@/models/Admins";

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// export async function POST(req: NextRequest) {
//   try {
//     await connectDB();

//     // 🔑 Auth check
//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }
//     let decoded: { id: string; role: string };
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };
//     } catch {
//       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//     }

//     if (decoded.role !== "Admin") {
//       return NextResponse.json({ success: false, message: "Only admin can upload tasks" }, { status: 403 });
//     }

//     // 📦 FormData
//     const formData = await req.formData();
//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const category = formData.get("category") as string;
//     const link = formData.get("link") as string;
//     const deadline = formData.get("deadline") as string;
//     const file = formData.get("file") as File | null;

//     // ❌ Required check
//     if (!title || !description || !deadline || !category || !file) {
//       return NextResponse.json(
//         { success: false, message: "Title, description, category, deadline and file are required" },
//         { status: 400 }
//       );
//     }

//     // ✅ Title & description validation
//     if (!/^[a-zA-Z0-9 ]+$/.test(title)) {
//       return NextResponse.json(
//         { success: false, message: "Title can only contain alphabets, numbers, and spaces" },
//         { status: 400 }
//       );
//     }

//     if (!/^[a-zA-Z0-9 ]+$/.test(description)) {
//       return NextResponse.json(
//         { success: false, message: "Description can only contain alphabets, numbers, and spaces" },
//         { status: 400 }
//       );
//     }

//     // ✅ Google Drive link validation
//     if (link) {
//       if (
//         !/^https?:\/\/(drive\.google\.com)\/(file\/d\/|open\?id=|uc\?id=|drive\/folders\/)[a-zA-Z0-9_-]+/.test(link)
//       ) {
//         return NextResponse.json(
//           { success: false, message: "Invalid Google Drive link" },
//           { status: 400 }
//         );
//       }
//     }

//     // // ✅ Deadline validation (DD-MM-YYYY → Date)
//     // if (!/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(19|20)\d\d$/.test(deadline)) {
//     //   return NextResponse.json(
//     //     { success: false, message: "Invalid date format (DD-MM-YYYY expected)" },
//     //     { status: 400 }
//     //   );
//     // }

//     // ✅ File validation (only PDF / DOCX)
//     let fileUrl: string | null = null;
//     if (file) {
//       const validMimeTypes = [
//         "application/pdf",
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       ];
//       const validExtensions = [".pdf", ".docx"];

//       const fileName = file.name.toLowerCase();
//       const isValidMime = validMimeTypes.includes(file.type);
//       const isValidExt = validExtensions.some(ext => fileName.endsWith(ext));

//       if (!isValidMime || !isValidExt) {
//         return NextResponse.json(
//           { success: false, message: "Only PDF or DOCX files are allowed" },
//           { status: 400 }
//         );
//       }

//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       // ✅ Upload with original name & extension
//       const uploadRes: { secure_url: string } = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//           {
//             folder: "tasks",
//             resource_type: "raw",
//             public_id: file.name.replace(/\.[^/.]+$/, ""), // keep original name
//             format: file.name.split(".").pop(),            // keep extension
//             use_filename: true,
//             unique_filename: false, // don't rename to random numbers
//           },
//           (error, result) => {
//             if (error) return reject(error);
//             resolve(result as { secure_url: string });
//           }
//         );
//         stream.end(buffer);
//       });

//       fileUrl = uploadRes.secure_url;
//     }

//     // ✅ Save Task
//     const task = await Task.create({
//       title,
//       description,
//       link,
//       category,
//       deadline,
//       file: fileUrl,
//       uploadedBy: decoded.id,
//     });

//     await Admin.findByIdAndUpdate(decoded.id, { $push: { uploadedTasks: task._id } });

//     return NextResponse.json({ success: true, task }, { status: 201 });
//   } catch (error: unknown) {
//     console.error("Error uploading task:", error);
//     const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
//     return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
//   }
// }

// export async function GET() {
//   try {
//     await connectDB();

//     const tasks = await Task.find()
//       .populate("uploadedBy")
//       .sort({ createdAt: -1 });

//     return NextResponse.json({ success: true, tasks });
//   } catch (error: unknown) {
//     const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
//     return NextResponse.json(
//       { success: false, message: errorMessage },
//       { status: 500 }
//     );
//   }
// }
