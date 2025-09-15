import nodemailer from "nodemailer";

export const mailSender = async (
  userEmail: string,
  subject: string,
  htmlContent: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send mail to yourself (admin)
    const info = await transporter.sendMail({
      from: `"TaskSphere Contact Form" <${process.env.MAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: subject,
      html: htmlContent,
    });

    return info;
  } catch (err) {
    console.error("MailSender error:", err);
    throw err;
  }
};