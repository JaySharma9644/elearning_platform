import { prisma } from "@/app/util/db";
import { sendEmail } from "@/app/util/email";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    // Query the database for the user using Prisma
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: "Email id not present in the system" },
        { status: 401 }
      );
    }

    // Generate a password reset token (you can use JWT or any other method)
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    const token = jwt.sign(
      { email, resetCode },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    const userExists = await prisma.user.update({
      where: { email },
      data: {
        resetCode: resetCode,
        resetCodeExpiresAt: new Date(Date.now() + 300000),
      }, // 5 min
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset",
      text: "Click the link to reset your password",
      html: `<p>Click <a href="http://localhost:3000/auth/reset_password?reference=${token}">link</a> to reset your password </p> `,
    };
    // Send email using nodemailer
    const result = await sendEmail(mailOptions);
    if (result.success) {
      return NextResponse.json(
        { message: "Email sent successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          message: "Technical issue please try again after some time",
          error: result.error,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Technical issue please try again after some time",
        error: error,
      },
      { status: 500 }
    );
  }
}
