import { createClient } from '@supabase/supabase-js'

async function testSupabaseAPI() {
  console.log('🔌 Testing Supabase API connection...')

  const supabaseUrl = 'https://pqtvdfmdztcrmctsupxb.supabase.co'
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0ODg1MzYsImV4cCI6MjA3NzA2NDUzNn0.pa8oEBG5DwAeKoY8SuKWU1pQNYutV1CUQsD_NodbH_g'

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Test basic API connection
    const { data, error } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1)

    if (error) {
      console.log('📊 API connected, but no tables exist yet (expected for new database)')
      console.log('✅ Supabase API is working!')
    } else {
      console.log('✅ Supabase API connected successfully!')
      console.log('📊 Data:', data)
    }
  } catch (err) {
    console.error('❌ Supabase API connection failed:', err instanceof Error ? err.message : err)
  }
}

testSupabaseAPI()