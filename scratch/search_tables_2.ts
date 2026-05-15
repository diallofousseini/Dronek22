
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function searchTables() {
  const common = ['contact_info', 'site_config', 'settings', 'config', 'general_settings']
  for (const t of common) {
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (!error) {
      console.log(`✅ Table ${t} exists!`)
    }
  }
}
searchTables()
