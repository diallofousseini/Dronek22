
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function findConfigTable() {
  const tables = ['site_info', 'company_info', 'contact_details', 'about_info', 'global_settings']
  for (const t of tables) {
    const { error } = await supabase.from(t).select('id').limit(0)
    if (!error) {
      console.log(`✅ Table ${t} exists!`)
    }
  }
}

findConfigTable()
