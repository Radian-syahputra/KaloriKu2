import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import User from '@/src/models/User';
import { hashPassword, signJwtToken } from '@/src/lib/auth';
import { fallbackStore } from '@/src/lib/serverFallbackStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Nama, email, dan password wajib diisi' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password minimal 6 karakter' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await hashPassword(password);

    let createdUser: {
      id: string;
      name: string;
      email: string;
      dailyCalorieTarget: number;
      birthDate?: string;
      height?: number;
      weight?: number;
      gender?: string;
    };

    const isConnected = await connectDB().catch(() => null);

    if (isConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar. Silakan login.' },
          { status: 409 }
        );
      }

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        dailyCalorieTarget: 2000,
        birthDate: '12 Januari 2000',
        height: 175,
        weight: 65,
        gender: 'Laki-laki',
      });

      createdUser = {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        dailyCalorieTarget: newUser.dailyCalorieTarget,
        birthDate: newUser.birthDate,
        height: newUser.height,
        weight: newUser.weight,
        gender: newUser.gender,
      };
    } else {
      // In-memory fallback
      const existing = fallbackStore.users.find((u) => u.email === normalizedEmail);
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'Email sudah terdaftar. Silakan login.' },
          { status: 409 }
        );
      }

      const newId = 'user-' + Date.now();
      const mockUser = {
        _id: newId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        dailyCalorieTarget: 2000,
        birthDate: '12 Januari 2000',
        height: 175,
        weight: 65,
        gender: 'Laki-laki',
        createdAt: new Date(),
      };
      fallbackStore.users.push(mockUser);

      createdUser = {
        id: newId,
        name: mockUser.name,
        email: mockUser.email,
        dailyCalorieTarget: mockUser.dailyCalorieTarget,
        birthDate: mockUser.birthDate,
        height: mockUser.height,
        weight: mockUser.weight,
        gender: mockUser.gender,
      };
    }

    const token = signJwtToken({
      userId: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
    });

    const response = NextResponse.json({
      success: true,
      message: 'Registrasi berhasil',
      user: createdUser,
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: unknown) {
    console.error('Register API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Terjadi kesalahan pada server saat registrasi' },
      { status: 500 }
    );
  }
}
