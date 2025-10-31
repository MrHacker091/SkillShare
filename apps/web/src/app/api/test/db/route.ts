import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    await prisma.$connect()

    // Get all users (limited for testing)
    const users = await prisma.user.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
        avatar: true
      }
    })

    // Get user count
    const userCount = await prisma.user.count()

    // Test query to verify connection
    const dbTest = await prisma.$queryRaw`SELECT NOW() as current_time`

    return NextResponse.json({
      success: true,
      message: 'Database connection successful',
      data: {
        users,
        userCount,
        dbTest,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Database test error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === 'test-user-creation') {
      // Test creating a sample user (for testing only)
      const testUser = await prisma.user.create({
        data: {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          role: 'CUSTOMER',
          isVerified: true
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Test user created successfully',
        user: testUser
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Database test POST error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Database operation failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}