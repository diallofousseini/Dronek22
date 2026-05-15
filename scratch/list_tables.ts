
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listTables() {
  console.log('Listing some data to see what we have...')
  
  // Try to find if there is a config table
  const tables = ['contacts', 'site_settings', 'settings', 'config']
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (error) {
      console.log(`Table ${t} error: ${error.message}`)
    } else {
      console.log(`Table ${t} exists and has ${data.length} rows. Sample:`, data[0])
    }
  }
}

listTables()
