import mongoose, { Schema, model, models } from "mongoose";

// Regex Validations
const nameReg = /^[A-Za-z ]+$/;  
const phoneReg = /^[6-9]\d{9}$/; 
const msgReg = /^[A-Za-z0-9 ]+$/;
const emailReg = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; 

const HelpSchema = new Schema(
  {
    name: { type: String, required: true, match: [nameReg, "Invalid Name"] },
    email: { type: String, required: true, match: [emailReg, "Only Gmail allowed"] },
    phoneNo: { type: String, required: true, match: [phoneReg, "Invalid Phone Number"] },
    msg: { type: String, required: true, match: [msgReg, "Invalid Message"] }
  },
  { timestamps: true }
);

const Help = models.Help || model("Help", HelpSchema);
export default Help;
