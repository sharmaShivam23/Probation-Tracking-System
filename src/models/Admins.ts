import mongoose, { Schema, model, models } from "mongoose";

const nameReg = /^[A-Za-z ]+$/;
const rollReg = /^23\d{5,6}$/;
const AdminSchema = new Schema(
  {
    role: { type: String, required: true, enum: ["Student", "Admin"] },
    name: { type: String, required: true, match: [nameReg, "Invalid Name"] },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    rollNo: {
      type: String,
      required: true,
      unique: true,
      match: [rollReg, "Invalid roll number"],
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "CSE",
        "CSE(AIML)",
        "CSE(DS)",
        "CSE(Hindi)",
        "CS",
        "IT",
        "CSIT",
        "ECE",
        "Mechanical",
        "Civil",
      ],
    },
    password: { type: String, required: true },
    code: { type: String, required: true },
    uploadedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
  },
  { timestamps: true }
);

const Admin = models.Admin || model("Admin", AdminSchema);
export default Admin;
