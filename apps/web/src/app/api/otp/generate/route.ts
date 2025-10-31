import { OTPService } from '@/lib/otp';
import { NextRequest, NextResponse } from 'next/server';

const otpService = OTPService.getInstance();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, type } = body;

    // Validate required fields
    if (!email || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, type' },
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

    // Validate type
    const validTypes = ['registration', 'password-reset', 'verification'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Invalid OTP type' },
        { status: 400 }
      );
    }

    // Generate and send OTP
    const result = await otpService.generateAndSendOTP(email, name, type);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 429 } // Too Many Requests for rate limiting
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      expiresIn: result.expiresIn
    });

  } catch (error) {
    console.error('Error in generate OTP API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const type = searchParams.get('type');

    if (!email || !type) {
      return NextResponse.json(
        { error: 'Missing email or type parameter' },
        { status: 400 }
      );
    }

    // Get OTP status for debugging (remove in production)
    const status = otpService.getOTPStatus(email, type);

    return NextResponse.json({
      success: true,
      status
    });

  } catch (error) {
    console.error('Error in OTP status API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}