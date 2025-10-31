// Force the environment variable first
process.env.DATABASE_URL = "postgresql://postgres:Ik1436677%40@db.pqtvdfmdztcrmctsupxb.supabase.co:5432/postgres"

import { PrismaClient } from './generated/prisma'

async function testDirectConnection() {
  console.log('🔌 Testing database connection with explicit URL...')
  console.log('📍 Using URL:', process.env.DATABASE_URL)

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Query result:', result)
  } catch (error) {
    console.log('❌ Database connection failed:')
    console.log(error)
  } finally {
    await prisma.$disconnect()
  }
}

testDirectConnection()