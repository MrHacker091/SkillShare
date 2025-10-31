import { PrismaClient } from './generated/prisma'

async function testConnection() {
  const prisma = new PrismaClient()

  try {
    console.log('🔌 Testing database connection...')

    // Simple test query
    await prisma.$connect()
    console.log('✅ Database connection successful!')

    // Try to check if tables exist
    const tableCount = await prisma.$queryRaw`
      SELECT COUNT(*) FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    console.log('📊 Database tables:', tableCount)

  } catch (error) {
    console.error('❌ Database connection failed:')
    console.error(error)

    if (error instanceof Error && error.message.includes('password')) {
      console.log('\n💡 It looks like you need to update the DATABASE_URL with your database password.')
      console.log('Please check your Supabase project settings for the database password.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()