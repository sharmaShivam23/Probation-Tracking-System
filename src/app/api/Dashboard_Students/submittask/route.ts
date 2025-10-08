


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import Candidate from "@/models/Candidate";
import Task from "@/models/Taskss"; 
import { globalLimiter, withRateLimit } from "@/lib/ratelimiter";
import axios from "axios";
import Joi from "joi";
import bcrypt from "bcryptjs";

const taskSchema = Joi.object({
  taskId: Joi.string().required(), 
  taskCategory: Joi.string().required(), 
  title: Joi.string()
    .pattern(/^[a-zA-Z0-9\-.,_\s ]+$/)
    .min(3)
    .max(30)
    .required(),

  description: Joi.string()
    .pattern(/^[A-Za-z0-9,\-._ ]+$/)
    .min(3)
    .max(150)
    .required(),

 github: Joi.string()
  .uri()
  .pattern(/^https:\/\/github\.com\/.+$/)
  .allow("", null)
  .optional(),


  deploy: Joi.string().uri().required(),
  uploadedBy: Joi.string().required(),
  recaptchaValue: Joi.string().required(),
});

async function submitTask(request: Request) {
  await connectDB();

  try {
    const body = await request.json();

  
    const { error, value } = taskSchema.validate(body);
    if (error) {
      return NextResponse.json(
        { success: false, message: error.details[0].message },
        { status: 400 }
      );
    }

    const { taskId, title,  taskCategory ,  description, github, deploy, uploadedBy , recaptchaValue } = value;

    
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


    const newSubmission = await UploadedTask.create({
      title,
      description,
      github,
      deploy,
      uploadedBy,
      task: taskId,
       taskCategory
    });

  
    await Candidate.findByIdAndUpdate(
      uploadedBy,
      { $push: { uploadedTasks: newSubmission._id } },
      { new: true }
    );

    
    await Task.findByIdAndUpdate(
      taskId,
      { $push: { submissions: newSubmission._id } },
      { new: true }
    )   

    return NextResponse.json({ success: true, task: newSubmission });
  } catch (error: unknown) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export const POST = withRateLimit(submitTask, globalLimiter);



export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { id, password, userId } = await req.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Task ID is required" },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

  
    const uploadedTask = await UploadedTask.findById(id);
    if (!uploadedTask) {
      return NextResponse.json(
        { success: false, message: "Uploaded task not found" },
        { status: 404 }
      );
    }

    const existingCandidate = await Candidate.findById(userId);
    if (!existingCandidate) {
      return NextResponse.json(
        { success: false, message: "Candidate not found" },
        { status: 404 }
      );
    }

    
    if (uploadedTask.uploadedBy.toString() !== userId.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: you do not own this task" },
        { status: 403 }
      );
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingCandidate.password
    );
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 400 }
      );
    }

    
    await Candidate.findByIdAndUpdate(uploadedTask.uploadedBy, {
      $pull: { uploadedTasks: uploadedTask._id },
    });

  
    await Task.findByIdAndUpdate(uploadedTask.task, {
      $pull: { submissions: uploadedTask._id },
    });

    
    await UploadedTask.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Uploaded task deleted successfully",
    });
  } catch (error: unknown) {
    console.error("Failed to delete task", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
