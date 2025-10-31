import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage for demo (in production, use a database)
const creatorAccounts = new Map<string, {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  university: string;
  major: string;
  verified: boolean;
}>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, action } = body

    if (action === 'login') {
      // Handle creator login
      const creator = creatorAccounts.get(email)
      
      if (!creator) {
        return NextResponse.json({ error: 'Account not found' }, { status: 404 })
      }

      if (!creator.verified) {
        return NextResponse.json({ error: 'Please verify your email first' }, { status: 401 })
      }

      if (creator.password !== password) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }

      // Return success with user info
      return NextResponse.json({
        success: true,
        user: {
          email: creator.email,
          name: `${creator.firstName} ${creator.lastName}`,
          role: 'CREATOR',
          university: creator.university,
          major: creator.major
        }
      })
    }

    if (action === 'register') {
      // Handle creator registration
      const { firstName, lastName, university, major } = body
      
      if (creatorAccounts.has(email)) {
        return NextResponse.json({ error: 'Account already exists' }, { status: 400 })
      }

      // Store new creator account
      creatorAccounts.set(email, {
        email,
        password,
        firstName,
        lastName,
        university,
        major,
        verified: true // Auto-verify for demo
      })

      return NextResponse.json({
        success: true,
        message: 'Creator account created successfully'
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    
  } catch (error) {
    console.error('Creator auth error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}