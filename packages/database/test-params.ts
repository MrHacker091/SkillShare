// Test with Supabase connection parameters
process.env.DATABASE_URL = "postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

import { PrismaClient } from './generated/prisma'

async function testWithParams() {
  console.log('🔌 Testing with pgbouncer parameters...')

  const prisma = new PrismaClient()

  try {
    await prisma.$connect()
    console.log('✅ Connection successful!')

    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Test query:', result)

  } catch (error: any) {
    console.log('❌ Failed:', error.code || error.message.split('\n')[0])

    // Let's also try the session mode connection
    console.log('\n🔄 Trying session mode connection...')

    process.env.DATABASE_URL = "postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677@aws-0-us-west-1.pooler.supabase.com:5432/postgres"

    const prisma2 = new PrismaClient()
    try {
      await prisma2.$connect()
      console.log('✅ Session mode successful!')

      const result2 = await prisma2.$queryRaw`SELECT 1 as test`
      console.log('Test query:', result2)
    } catch (error2: any) {
      console.log('❌ Session mode failed:', error2.code || error2.message.split('\n')[0])
    } finally {
      await prisma2.$disconnect()
    }

  } finally {
    await prisma.$disconnect()
  }
}

testWithParams()