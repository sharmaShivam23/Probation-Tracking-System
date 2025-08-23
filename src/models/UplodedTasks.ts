// // Task.ts
// import mongoose, { Schema, model, models } from "mongoose";

// const TaskSchema = new Schema(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     github : {types : String , required : true},
//     deploy : {types : String , required : true},
//     uploadedBy: {types : String , required : true},
//   },
//   { timestamps: true }
// );

// const UplodedTask = models.UplodedTask || model("UplodedTasks", TaskSchema);
// export default UplodedTask;

import mongoose, { Schema, model, models } from "mongoose";

const TaskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    github: { type: String, required: true },
    deploy: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId, // references Candidate
      ref: "Candidate",
      required: true,
    },
  },
  { timestamps: true }
);

const UploadedTask = models.UploadedTask || model("UploadedTask", TaskSchema);
export default UploadedTask;
