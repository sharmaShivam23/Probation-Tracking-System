import mongoose, { Schema, model, models } from "mongoose";

const AttendanceSchema = new Schema(
  {
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", required: true },
    date: { type: Date, required: true }, // store as date (we'll normalize to date-only)
    status: { type: String, enum: ["Present", "Absent"], required: true },
  },
  { timestamps: true }
);

// Use existing model if compiled already (prevents recompilation error in dev)
const Attendance = models.Attendance || model("Attendance", AttendanceSchema);
export default Attendance;
