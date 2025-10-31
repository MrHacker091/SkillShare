// Let's try to connect using the Supabase JavaScript client instead
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqtvdfmdztcrmctsupxb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5OTg1MTUsImV4cCI6MjA1MTU3NDUxNX0.WnOXTRCKfzMVCjErrd0TnShuuNN6k6XNTWWmzMxTQCo'

async function testSupabaseJS() {
  console.log('🔌 Testing Supabase connection via JS client...')

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Test a simple query - try to get the current user (which might be null, but should not error)
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      console.log('❌ Auth error:', error.message)
    } else {
      console.log('✅ Supabase connection working! (No user logged in, which is expected)')
    }

    // Try to access the database - let's try creating a simple table first
    console.log('\n📋 Testing database access...')

    const { data: tableData, error: tableError } = await supabase
      .from('users')  // This table doesn't exist yet, so we expect an error
      .select('*')
      .limit(1)

    if (tableError) {
      console.log('📋 Table error (expected):', tableError.message)
      if (tableError.message.includes('does not exist')) {
        console.log('✅ Database is reachable! Tables just need to be created.')
      }
    } else {
      console.log('📋 Tables exist:', tableData)
    }

  } catch (err: any) {
    console.log('❌ Supabase client error:', err.message)
  }
}

testSupabaseJS()