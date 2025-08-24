

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

//     const token = req.headers.get("authorization")?.split(" ")[1];
//     if (!token) {
//       return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
//     }

//     let decoded: any;
//     try {
//       decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     } catch {
//       return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
//     }

//     const formData = await req.formData();
//     const title = formData.get("title") as string;
//     const description = formData.get("description") as string;
//     const category = formData.get("category") as string;
//     const link = formData.get("link") as string;
//     const deadline = formData.get("deadline") as string;
//     const file = formData.get("file") as File | null;

//     if (!title || !description || !deadline || !category) {
//       return NextResponse.json(
//         { success: false, message: "Title, description, category, and deadline are required" },
//         { status: 400 }
//       );
//     }

//     let fileUrl: string | null = null;

//     if (file) {
//       const arrayBuffer = await file.arrayBuffer();
//       const buffer = Buffer.from(arrayBuffer);

//       const uploadRes: any = await new Promise((resolve, reject) => {
//         const stream = cloudinary.uploader.upload_stream(
//   { folder: "tasks", resource_type: "raw" }, 
//   (error, result) => {
//     if (error) return reject(error);
//     resolve(result);
//   }
// );

//         stream.end(buffer);
//       });

//       fileUrl = uploadRes.secure_url;
//     }

//     const task = await Task.create({
//       title,
//       description,
//       link,
//       category,  
//       deadline: new Date(deadline),
//       file: fileUrl,
//       uploadedBy: decoded.id,
//     });

//     await Admin.findByIdAndUpdate(decoded.id, { $push: { uploadedTasks: task._id } });

//     return NextResponse.json({ success: true, task }, { status: 201 });
//   } catch (error: any) {
//     console.error("Error uploading task:", error);
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


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

    // 🔹 1. Get token
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

    // 🔹 3. Check role (only admin can upload)
    if (decoded.role !== "Admin") {
      return NextResponse.json({ success: false, message: "Only admin can upload tasks" }, { status: 403 });
    }

    // 🔹 4. Handle form data
    const formData = await req.formData();
    const title = formData.get("title") as string;
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

    // 🔹 5. Upload file to Cloudinary (if exists)
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

    // 🔹 6. Create Task
    const task = await Task.create({
      title,
      description,
      link,
      category,
      deadline: new Date(deadline),
      file: fileUrl,
      uploadedBy: decoded.id,
    });

    // 🔹 7. Save reference in Admin model
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
