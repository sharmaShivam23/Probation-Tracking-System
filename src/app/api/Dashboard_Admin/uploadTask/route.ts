

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Task from "@/models/Taskss";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import Admin from "@/models/Admins";
import { globalLimiter, withRateLimit } from "@/lib/ratelimiter";
import mailSender from "@/components/mailSender";
import fs from "fs";
import path from "path";
import axios from "axios";
import Candidate from "@/models/Candidate";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const allowedMimeTypes = [
  "application/pdf",
  "application/msword", // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
];


async function uploadTask(request: NextRequest) {
  try {
    await connectDB();

    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    let decoded: { id: string; role: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        role: string;
      };
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 }
      );
    }

    if (decoded.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Only admin can upload tasks" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const title = formData.get("title") as string;
    const code = formData.get("code") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const link = formData.get("link") as string;
    const deadline = formData.get("deadline") as string;
    const recaptchaValue = formData.get("recaptchaValue") as string;
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

    if (new Date(deadline) < new Date()) {
  return NextResponse.json({ success: false, message: "Deadline must be in the future" }, { status: 400 });
}


    if (link) {
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

    if (code !== process.env.SECURITY_CODE_fILE) {
      return NextResponse.json(
        { success: false, message: "Invalid Security Code" },
        { status: 400 }
      );
    }

   let fileUrl: string | null = null;

if (file) {
  if (!allowedMimeTypes.includes(file.type)) {
    throw new Error("Invalid file type. Only PDF, DOC, DOCX are allowed.");
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const uploadRes: { secure_url: string } = await new Promise(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "tasks", resource_type: "raw" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result as { secure_url: string });
        }
      );
      stream.end(buffer);
    }
  );

  fileUrl = uploadRes.secure_url;
}


    
    
         if (!recaptchaValue) {
          return NextResponse.json(
            { success: false, message: "recaptcha not found" },
            { status: 400 }
          );
        }
    
        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
        const secretKey = process.env.SECRET_KEY;
        const recaptchaResponse = await axios.post(verifyUrl, null, {
          params: {
            secret: secretKey,
            response: recaptchaValue,
          },
        });
    
        if (!recaptchaResponse.data.success) {
          return NextResponse.json(
            { success: false, message: "reCAPTCHA verification failed" },
            { status: 400 }
          );
    
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

    const decode = await Admin.findByIdAndUpdate(decoded.id, {
      $push: { uploadedTasks: task._id },
    });

    const candidates = await Candidate.find({}, { email: 1, _id: 0 });
    const studentEmails = candidates.map((c) => c.email);

    try {
      const templatePath = path.join(process.cwd(), "src", "templates", "uplodedTask.html");

      if (!fs.existsSync(templatePath)) {
        return NextResponse.json(
          { success: false, message: "Task template not found" },
          { status: 500 }
        );
      }

      let TaskTemplate = fs.readFileSync(templatePath, "utf8");
      TaskTemplate = TaskTemplate
        .replace("{{title}}", title)
        .replace("{{category}}", category)
        .replace("{{deadline}}", deadline)
        .replace("{{uploadedBy}}", decode?.name || "Admin");

      await Promise.all(
        studentEmails.map((email) =>
          mailSender(email, `📢 New Task Uploaded: ${title}`, TaskTemplate)
        )
      );
    } catch (err) {
      console.error("Error sending task emails:", err);
    }

    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error uploading task:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(uploadTask, globalLimiter);

export async function GET() {
  try {
    await connectDB();

    // const tasks = await Task.find().populate("uploadedBy").sort({ createdAt: -1 });
    const tasks = await Task.find()
  .populate({ path: "uploadedBy", select: "name email role" }) 
  .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, tasks });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
