
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function trySql() {
  const sql = `
    ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone TEXT;
    ALTER TABLE contacts ADD COLUMN IF NOT EXISTS location TEXT;
    ALTER TABLE contacts ADD COLUMN IF NOT EXISTS category TEXT;
    ALTER TABLE contacts ADD COLUMN IF NOT EXISTS titre TEXT;
  `
  // This is a long shot, but worth a try if the user has an exec_sql RPC
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql })
  
  if (error) {
    console.log('RPC exec_sql failed:', error.message)
    // Try another common name
    const { error: e2 } = await supabase.rpc('run_sql', { sql: sql })
    if (e2) {
      console.log('RPC run_sql failed:', e2.message)
    } else {
      console.log('✅ Columns added via run_sql!')
    }
  } else {
    console.log('✅ Columns added via exec_sql!')
  }
}

trySql()
