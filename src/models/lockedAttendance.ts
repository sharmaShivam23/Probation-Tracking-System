
import mongoose, { Schema, model, models } from "mongoose";

const lockedAttendanceSchema = new Schema({
  date: { type: String, required: true, unique: true },
  lockedBy: { type: String }, 
  lockedAt: { type: Date, default: Date.now },
});

const LockedAttendance = models.LockedAttendance || model("LockedAttendance", lockedAttendanceSchema);

export default LockedAttendance;
