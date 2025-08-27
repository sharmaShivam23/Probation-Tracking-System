import mongoose, { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    date: { type: Date, required: true }, 
    status: { type: String, enum: ["Present", "Absent"], required: true },
  },
  { timestamps: true }
);


const Attendance = models.Attendance || model("Attendance", AttendanceSchema);
export default Attendance;
