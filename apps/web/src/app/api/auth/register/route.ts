import { creatorUsers, customerUsers, type CreatorUser, type CustomerUser } from '@/lib/storage'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      firstName,
      lastName,
      email,
      password,
      university,
      major,
      userType,
      isVerified
    } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate user type
    if (userType !== 'creator' && userType !== 'customer') {
      return NextResponse.json(
        { message: 'Invalid user type' },
        { status: 400 }
      )
    }

    // Check if user already exists in either storage
    if (creatorUsers.has(email) || customerUsers.has(email)) {
      return NextResponse.json(
        { message: 'User already exists with this email' },
        { status: 409 }
      )
    }

    let responseData: any;

    if (userType === 'creator') {
      // Create new creator user
      const newUser: CreatorUser = {
        email,
        password, // In production, hash the password!
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        university: university || '',
        major: major || '',
        isVerified: isVerified || false,
        createdAt: new Date()
      }
      creatorUsers.set(email, newUser)

      responseData = {
        success: true,
        message: 'Creator registered successfully',
        user: {
          email: newUser.email,
          name: newUser.name,
          university: newUser.university,
          major: newUser.major,
          isVerified: newUser.isVerified,
          userType: 'creator'
        }
      }
    } else {
      // Create new customer user
      const newUser: CustomerUser = {
        email,
        password, // In production, hash the password!
        name: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isVerified: isVerified || false,
        createdAt: new Date()
      }
      customerUsers.set(email, newUser)

      responseData = {
        success: true,
        message: 'Customer registered successfully',
        user: {
          email: newUser.email,
          name: newUser.name,
          isVerified: newUser.isVerified,
          userType: 'customer'
        }
      }
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

