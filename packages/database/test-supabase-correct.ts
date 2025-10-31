// Test with correct Supabase username format
process.env.DATABASE_URL = "postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

import { PrismaClient } from './generated/prisma'

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection with correct format...')
  console.log('📍 Username: postgres.pqtvdfmdztcrmctsupxb')
  console.log('📍 Host: aws-0-us-west-1.pooler.supabase.com')
  console.log('📍 Port: 6543')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Test a simple query
    const result = await prisma.$queryRaw`SELECT version()`
    console.log('Database version:', result)

    // Test creating a table (if it works, we can proceed with schema push)
    console.log('\n📋 Testing schema operations...')

  } catch (error: any) {
    console.log('❌ Database connection failed:')
    console.log('Error code:', error.code)
    console.log('Error message:', error.message.split('\n')[0])
  } finally {
    await prisma.$disconnect()
  }
}

testSupabaseConnection()