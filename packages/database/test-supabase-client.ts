import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqtvdfmdztcrmctsupxb.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg1MTUsImV4cCI6MjA1MTU3NDUxNX0.WnOXTRCKfzMVCjErrd0TnShuuNN6k6XNTWWmzMxTQCo'

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...')

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test connection by trying to fetch from a system table
    const { data, error } = await supabase
      .from('information_schema')
      .select('*')
      .limit(1)

    if (error) {
      console.log('❌ Supabase connection failed:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('Data sample:', data)
    }
  } catch (err) {
    console.log('❌ Supabase connection error:', err)
  }
}

testSupabaseConnection()