import { NextResponse } from 'next/server';
import { prisma } from '@/app/util/db';
import { comparePassword } from '@/app/util/auth';
import jwt from 'jsonwebtoken';
import { headers } from 'next/headers';
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Query the database for the user using Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Compare password
    const isValidPassword = comparePassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    const token = jwt.sign({ userId: userWithoutPassword.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

    const response = NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword,
      token
     
    });
    response.cookies.set('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,// 7days 
      path: '/',
    }); 

    return response

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
