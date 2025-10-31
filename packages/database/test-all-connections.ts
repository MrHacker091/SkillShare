// Try different connection formats
const connectionStrings = [
  "postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677%40@aws-0-us-west-1.pooler.supabase.com:6543/postgres",
  "postgresql://postgres:Ik1436677%40@db.pqtvdfmdztcrmctsupxb.supabase.co:5432/postgres",
  "postgresql://postgres.pqtvdfmdztcrmctsupxb:Ik1436677%40@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
]

import { PrismaClient } from './generated/prisma'

async function testConnections() {
  for (let i = 0; i < connectionStrings.length; i++) {
    const url = connectionStrings[i]
    console.log(`\n🔌 Testing connection ${i + 1}/3...`)
    console.log('📍 URL:', url.replace(/:[^:@]+@/, ':****@'))

    process.env.DATABASE_URL = url
    const prisma = new PrismaClient()

    try {
      await prisma.$connect()
      console.log('✅ SUCCESS! This connection works!')

      // Test a simple query
      const result = await prisma.$queryRaw`SELECT version()`
      console.log('Database version:', result)
      break
    } catch (error) {
      console.log('❌ Failed:', error instanceof Error ? error.message.split('\n')[0] : 'Unknown error')
    } finally {
      await prisma.$disconnect()
    }
  }
}

testConnections()