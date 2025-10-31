// Test with service role key for full access
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pqtvdfmdztcrmctsupxb.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxdHZkZm1kenRjcm1jdHN1cHhiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTk5ODUxNSwiZXhwIjoyMDUxNTc0NTE1fQ.b5FJyvmPoRs8o46YhPt6lWP9WioQ5TQv48Op8Ks_Oyc'

async function testServiceRole() {
  console.log('🔌 Testing with service role key...')

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // Try to access system tables to confirm we're connected
    const { data, error } = await supabase
      .rpc('version')  // This should work if the connection is good

    if (error) {
      console.log('❌ RPC error:', error.message)

      // Try a simple table query instead
      const { data: tables, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .limit(5)

      if (tableError) {
        console.log('❌ Table query error:', tableError.message)
      } else {
        console.log('✅ Connected! System tables:', tables)
      }
    } else {
      console.log('✅ Service role connection successful!')
      console.log('Database version:', data)
    }

  } catch (err: any) {
    console.log('❌ Service role error:', err.message)
  }
}

testServiceRole()