

import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    // taskId : {type: String, required: true},
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task", 
      required: true,
    },
    title: { type: String, required: true },
    taskCategory: { type: String, required: true },
    description: { type: String, required: true },
    github: { type: String, required: true },
    deploy: { type: String, required: true },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: null, 
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Candidate",
      required: true,
    },
  },
  { timestamps: true }
);

const UploadedTask = models.UploadedTask || model("UploadedTask", TaskSchema);
export default UploadedTask;
