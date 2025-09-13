
import nodemailer from 'nodemailer';
// import 'dotenv/config';

const mailSender = async (email: string, title: string, body: string) => {
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

    const info = await transporter.sendMail({
      from: `"TaskSphere" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });


    return info;

  } catch (err) {
    console.error("MailSender error:", err);
    throw err;
  }
};

export default mailSender;