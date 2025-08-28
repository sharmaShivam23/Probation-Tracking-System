// Task.ts
import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    file: { type: String  },
    link: { type: String , required : true},
    deadline: { type: Date, required: true },
    category: { 
    type: String, 
    enum: [
      "Frontend Task",
      "Backend Task",
      "UI/UX Task",
      "Cloud Computing Task",
      "App Development Task",
      "Video Editing Task"
    ],
    required: true
  },
   uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Task = models.Task || model("Task", TaskSchema);
export default Task;
