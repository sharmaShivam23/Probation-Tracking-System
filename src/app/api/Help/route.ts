import { NextResponse } from "next/server";
import Help from "@/models/Help";
import { mailSender } from "@/components/mailSender2";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
export async function POST(req: Request) {

  await connectDB()
   
  try {

    
    
    const body = await req.json();
    const { name, email, phoneNo, msg } = body;

   
    if (!name || !email || !phoneNo || !msg) {
      return NextResponse.json({ status: 400, success: false, message: "All fields are required" });
    }

    if (!/^[A-Za-z ]+$/.test(name)) {
      return NextResponse.json({ status: 400, success: false, message: "Invalid Name" });
    }

    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
      return NextResponse.json({ status: 400, success: false, message: "Invalid Email (only Gmail allowed)" });
    }

    if (!/^[6-9]\d{9}$/.test(phoneNo)) {
      return NextResponse.json({ status: 400, success: false, message: "Invalid Phone Number (must be 10 digits, start with 6-9)" });
    }

    if (!/^[a-zA-Z0-9 .,!?'-]+$/.test(msg)) {
      return NextResponse.json({ status: 400, success: false, message: "Message contains invalid characters" });
    }

  
    await Help.create({ name, email, phoneNo, msg });

    try {
      
      const templatePath = path.join(process.cwd(), "src", "templates", "contactTemplate.html");
      if (!fs.existsSync(templatePath)) {
        throw new Error("contact template not found");
      }

      let contactTemplate = fs.readFileSync(templatePath, "utf8");

      
      contactTemplate = contactTemplate
        .replace("{{name}}", name)
        .replace("{{email}}", email)
        .replace("{{phoneNo}}", phoneNo)
        .replace("{{msg}}", msg);

      await mailSender(email, "New Contact Form Submission", contactTemplate);

      return NextResponse.json({ success: true, message: "Message received successfully" });
    } catch (err) {
      console.error("Mail error:", err);
      return NextResponse.json({ success: false, message: "Message saved but failed to send email" });
    }
  } catch (error: unknown) {
    console.error("Server error:", error);
    const errorMessage = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ success: false, message: errorMessage });
  }
}
