import { NextResponse } from 'next/server';
import { prisma } from '@/app/util/db';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name ?? null
      }
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    const token = jwt.sign({ userId: userWithoutPassword.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
    return NextResponse.json({
      message: 'User registered successfully',
      user: userWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
