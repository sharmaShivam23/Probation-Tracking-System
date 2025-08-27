
import mongoose, { Schema, model, models } from "mongoose";

let nameReg = /^[A-Za-z ]+$/;
let emailReg = /^[a-z]{3,15}24\d{5,6}@akgec\.ac\.in$/;
let rollReg = /^24\d{5,6}$/;
const githubReg = /^https:\/\/github\.com\/[A-Za-z0-9-]{1,39}$/;


const CandidateSchema = new Schema(
  {
    role: { type: String, required: true, enum: ["Student", "Admin"] },
    name: { type: String, required: true, match: [nameReg, "Inalvalid name"] },
    email: { type: String, required: true, unique: true, match: [emailReg, "Invalid email"] },
    rollNo: { type: String, required: true, unique: true, match: [rollReg, "Invalid roll number"] },
    branch: {
      type: String, required: true, enum: ["CSE",
        "CSE(AIML)",
        "CSE(DS)",
        "CSE(Hindi)",
        "CS",
        "IT",
        "CSIT",
        "ECE",
        "Mechanical",
        "Civil",]
    },
    github: { type: String, required: true, match: [githubReg, "Invalid Github Id"] },
    password: { type: String, required: true },
    domain: {
      type: String, enum: ["Frontend Development",
        "Backend Development",
        "App Development",
        "UI/UX Designing",
        "Cloud Computing",
        "Video Editing",
        "Other",]
    },

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

CandidateSchema.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }
  next();
});

const Candidate = models.Candidate || model("Candidate", CandidateSchema);
export default Candidate;
