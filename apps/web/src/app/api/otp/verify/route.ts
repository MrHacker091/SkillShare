import { OTPService } from '@/lib/otp';
import { NextRequest, NextResponse } from 'next/server';

const otpService = OTPService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code, type } = body;

    // Validate required fields
    if (!email || !code || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: email, code, type' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate OTP code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid OTP format. Must be 6 digits.' },
        { status: 400 }
      );
    }

    // Validate type
    const validTypes = ['registration', 'password-reset', 'verification'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid OTP type' },
        { status: 400 }
      );
    }

    // Verify OTP
    const result = await otpService.verifyOTP(email, code, type);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      data: result.data
    });

  } catch (error) {
    console.error('Error in verify OTP API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}