// Candidate.ts
import mongoose, { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema(
  {
    role: { type: String, required: true, enum: ["Student", "Admin"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    github: { type: String, required: true },
    password: { type: String, required: true },
    domain : {type : String , enum : ["Frontend development" , "Backend development" ,"App development" , "UI/UX designing" , "Cloud Computing" , "video Editor" , "other"]},
    uploadedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UploadedTask",
      },
    ],
    probationStatus: { type: String, default: "active", enum: ["active", "completed", "failed"] },
  },
  { timestamps: true }
);

const Candidate = models.Candidate || model("Candidate", CandidateSchema);
export default Candidate;
