import { EmailService } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    const emailService = EmailService.getInstance()
    const otp = emailService.generateOTP()

    const success = await emailService.sendOTPEmail({
      email,
      name,
      otp,
      type: 'verification'
    })

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully!',
        otp: otp // Only for testing - remove in production
      })
    } else {
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
    }
  } catch (error) {
    console.error('Email test error:', error)
    return NextResponse.json({
      error: 'Failed to send test email',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}