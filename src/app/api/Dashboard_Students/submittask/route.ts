
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import UplodedTask from "@/models/UplodedTasks";
// import Candidate from "@/models/Candidate";
// import { globalLimiter, withRateLimit } from "@/lib/ratelimiter";
// import axios from "axios";
// import Joi from "joi";
// import Task from "@/models/Taskss";

// const taskSchema = Joi.object({
//   taskId: Joi.string().required(), 
//   title: Joi.string()
//     .pattern(/^[A-Za-z0-9 ]+$/) 
//     .min(3)
//     .max(30)
//     .required(),

//   description: Joi.string()
//     .pattern(/^[A-Za-z0-9 ]+$/)
//     .min(3)
//     .max(150)
//     .required(),

//   github: Joi.string()
//     .uri()
//     .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/) 
//     // .pattern(/^https:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/) 
//     .required(),

//   deploy: Joi.string()
//     .uri()
//     .required(),

//   uploadedBy: Joi.string().required(),
//   recaptchaValue: Joi.string().required(),
// });

// async function submitTask(request: Request) {
//   await connectDB();

//   try {
//     const body = await request.json();

  
//     const { error, value } = taskSchema.validate(body);
//     if (error) {
//       return NextResponse.json(
//         { success: false, message: error.details[0].message },
//         { status: 400 }
//       );
//     }

//     const { title, description, github, deploy, uploadedBy, recaptchaValue } = value;

    
//     const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
//     const secretKey = process.env.SECRET_KEY;
//     const recaptchaResponse = await axios.post(verifyUrl, null, {
//       params: {
//         secret: secretKey,
//         response: recaptchaValue,
//       },
//     });

//     if (!recaptchaResponse.data.success) {
//       return NextResponse.json(
//         { success: false, message: "reCAPTCHA verification failed" },
//         { status: 400 }
//       );
//     }

    
    
//     const newTask = await UplodedTask.create({
//       title,
//       description,
//       github,
//       deploy,
//       uploadedBy,
//     });

//     await Candidate.findByIdAndUpdate(
//       uploadedBy,
//       { $push: { uploadedTasks: newTask._id } },
//       { new: true }
//     );
    
// //     await Task.findByIdAndUpdate(
// //   body.taskId, 
// //   { $push: { submissions: newTask._id } },
// //   { new: true }
// // );

//     return NextResponse.json({ success: true, task: newTask });
//   } catch (error: unknown) {
//     console.error("Task creation error:", error);
//     return NextResponse.json(
//       { success: false, message: "Server error" },
//       { status: 500 }
//     );
//   }
// }

// export const POST = withRateLimit(submitTask, globalLimiter);


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UploadedTask from "@/models/UplodedTasks";
import Candidate from "@/models/Candidate";
import Task from "@/models/Taskss"; 
import { globalLimiter, withRateLimit } from "@/lib/ratelimiter";
import axios from "axios";
import Joi from "joi";

const taskSchema = Joi.object({
  taskId: Joi.string().required(), 
  title: Joi.string()
    .pattern(/^[A-Za-z0-9 ]+$/)
    .min(3)
    .max(30)
    .required(),

  description: Joi.string()
    .pattern(/^[A-Za-z0-9 ]+$/)
    .min(3)
    .max(150)
    .required(),

  github: Joi.string()
    .uri()
    .pattern(/^https:\/\/github\.com\/.+$/) 
    .required(),

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

    const { taskId, title, description, github, deploy, uploadedBy , recaptchaValue } = value;

    
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
