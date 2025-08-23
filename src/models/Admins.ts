import mongoose, { Schema, model, models } from "mongoose";

const AdminSchema = new Schema(
  {
    role: { type: String, required: true, enum: ["Student", "Admin"] },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    rollNo: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    password: { type: String, required: true },
    code: { type: String , required : true },
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
