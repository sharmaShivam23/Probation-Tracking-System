// src/app/api/tasks/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UplodedTask from "@/models/UplodedTasks";
import Candidate from "@/models/Candidate";

export async function POST(req: Request) {
  await connectDB();

  try {
    const body = await req.json();
    const { title, description, github, deploy, uploadedBy } = body;

    if (!title || !description || !github || !deploy || !uploadedBy) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }


    const newTask = await UplodedTask.create({
      title,
      description,
      github,
      deploy,
      uploadedBy,
    });

    await Candidate.findByIdAndUpdate(
      uploadedBy,
      { $push: { uploadedTasks: newTask._id } },
      { new: true }
    );

    return NextResponse.json({ success: true, task: newTask });
  } catch (error: unknown) {
    console.error("Task creation error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
