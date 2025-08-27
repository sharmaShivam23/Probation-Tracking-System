
const nodemailer = require('nodemailer');
require('dotenv').config();

const mailSender = async (email : string, title : string, body : string) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,  
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({  
      from: `"EduPortal" <${process.env.MAIL_USER}>`, 
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

module.exports = mailSender;