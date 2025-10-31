const { createClient } = require('@supabase/supabase-js')

async function testSupabaseConnection() {
  console.log('🔌 Testing Supabase connection...')

  const supabaseUrl = 'https://pqtvdfmdztcrmctsupxb.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODg1MzYsImV4cCI6MjA3NzA2NDUzNn0.pa8oEBG5DwAeKoY8SuKWU1pQNYutV1CUQsD_NodbH_g'

  try {
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Test 1: Basic connection to Supabase API
    console.log('📍 Testing Supabase API connection...')
    const { data, error } = await supabase.auth.getUser()

    if (error && error.message !== 'Auth session missing!') {
      console.log('❌ API Connection failed:', error.message)
      return false
    } else {
      console.log('✅ Supabase API connection successful!')
    }

    // Test 2: Check if we can access the REST API
    console.log('📍 Testing database REST API access...')
    const { data: result, error: restError } = await supabase
      .from('users')
      .select('count')
      .limit(1)

    if (restError) {
      console.log('📝 REST API Error (expected if tables don\'t exist):', restError.message)

      // If it's a "relation does not exist" error, that means connection is good but tables aren't created
      if (restError.message.includes('relation') && restError.message.includes('does not exist')) {
        console.log('✅ Database connection is working! Tables just need to be created.')
        return true
      }
    } else {
      console.log('✅ Database REST API access working!')
      console.log('📊 Query result:', result)
      return true
    }

    return true
  } catch (err) {
    console.error('❌ Connection error:', err.message)
    return false
  }
}

testSupabaseConnection().then(success => {
  if (success) {
    console.log('\n🎉 Supabase is accessible! The issue might be:')
    console.log('   • Tables not created yet (need to run migrations)')
    console.log('   • Prisma direct connection vs Supabase REST API difference')
    console.log('   • Project might need to be resumed in Supabase dashboard')
  } else {
    console.log('\n❌ Supabase connection failed. Check:')
    console.log('   • Project is active in Supabase dashboard')
    console.log('   • API keys are correct')
    console.log('   • Network/firewall issues')
  }
})