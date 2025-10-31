import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

// Temporary in-memory storage (in production, use a database)
const userRoles = new Map<string, string>()

// Temporary in-memory storage for creator profiles (in production, use a database)
const creatorProfiles = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Get NextAuth session - production authentication only
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized - Please log in' }, { status: 401 })
    }

    const userEmail = session.user.email
    const userName = session.user.name

    // Validate creator data if provided
    if (body.creatorData) {
      const { university, major, skills } = body.creatorData
      if (!university || !major || !skills) {
        return NextResponse.json({
          error: 'Missing required creator information (university, major, skills)'
        }, { status: 400 })
      }

      // Store creator profile data
      creatorProfiles.set(userEmail, {
        ...body.creatorData,
        createdAt: new Date().toISOString(),
        approved: true // Auto-approve for demo
      })
    }

    // Update user role to CREATOR (stored in memory for demo)
    userRoles.set(userEmail, 'CREATOR')

    const upgradedUser = {
      email: userEmail,
      name: userName,
      role: 'CREATOR',
      isCreator: true,
      id: session.user.id,
      creatorProfile: creatorProfiles.get(userEmail)
    }

    return NextResponse.json({
      success: true,
      user: upgradedUser,
      message: 'Successfully upgraded to CREATOR'
    })
  } catch (error) {
    console.error('Error upgrading user role:', error)
    return NextResponse.json({ error: 'Failed to upgrade role' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get current user role from memory (or default to CUSTOMER)
    const role = userRoles.get(session.user.email) || 'CUSTOMER'

    return NextResponse.json({
      success: true,
      user: {
        email: session.user.email,
        name: session.user.name,
        role: role,
        isVerified: true,
      },
      canUpgradeToCreator: role === 'CUSTOMER'
    })
  } catch (error) {
    console.error('Error getting user role:', error)
    return NextResponse.json({ error: 'Failed to get user role' }, { status: 500 })
  }
}