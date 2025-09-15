import { NextResponse } from "next/server";
import Help from "@/models/Help";
import { mailSender } from "@/components/mailSender2";
import fs from "fs";
import path from "path";
import { connectDB } from "@/lib/db";
import { registrationLimiter, withRateLimit } from "@/lib/ratelimiter";
import axios from "axios";
async function HelpForm(request: Request) {

  await connectDB()

  try {

    const body = await request.json();
    const { name, email, phoneNo, msg, recaptchaValue } = body;


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


    if (!recaptchaValue) {
      return NextResponse.json(
        { success: false, message: "recaptcha not found" },
        { status: 400 }
      );
    }

    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;
    const secretKey = process.env.SECRET_KEY;
    const recaptchaResponse = await axios.post(verifyUrl, null, {
      params: {
        secret: secretKey,
        response: recaptchaValue,
      },
    });

    if (!recaptchaResponse.data.success) {
      return NextResponse.json(
        { success: false, message: "reCAPTCHA verification failed" },
        { status: 400 }
      );

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
        .replace("{{msg}}", msg)
        .replace("{{year}}", new Date().getFullYear().toString());

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

export const POST = withRateLimit(HelpForm, registrationLimiter);