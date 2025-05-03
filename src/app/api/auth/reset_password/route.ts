import { prisma } from "@/app/util/db";
import { sendEmail } from "@/app/util/email";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { password, token } = await request.json();

    // decode token

    const decodedToken = await jwt.verify(
      token,
      process.env.JWT_SECRET as string,
      async (err: any, decoded: any) => {
        if (err) {
          return NextResponse.json(
            { error: "Link is not Valid or expired" },
            { status: 401 }
          );
        }
        let email = decoded.email;
        let resetCode = decoded.resetCode;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return NextResponse.json(
            { error: "Link is not Valid or expired" },
            { status: 401 }
          );
        }
        if (user.resetCode == null || user.resetCode != resetCode) {
          return NextResponse.json(
            { error: "Link is not Valid or expired" },
            { status: 401 }
          );
        }
        if (user?.resetCodeExpiresAt == null) {
          return NextResponse.json(
            { error: "Link is not Valid or expired" },
            { status: 401 }
          );
        }

        if (user?.resetCodeExpiresAt < new Date(Date.now())) {
          return NextResponse.json(
            { error: "Link is not Valid or expired" },
            { status: 401 }
          );
        }
         // Hash password 
        const hashedPassword = await bcrypt.hash(password, 10);
    
        const userExists = await prisma.user.update({
          where: { email },
          data: {
            resetCode: null,
            resetCodeExpiresAt: null,
            password: hashedPassword,
          }, // 5 min
        });

        return NextResponse.json(
          {
            message: "Password Reset successfully",
          },
          { status: 201 }
        );

      }
    );
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
