import nodemailer from "nodemailer";


var transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVER_SERVICE,
  host:  process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD 
  },
}, {})

export async function sendEmail(mailOptions: any) {
  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
