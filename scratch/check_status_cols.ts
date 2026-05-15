
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkAllStatusCols() {
  const tables = ['projets', 'actualites', 'equipe', 'production_sites', 'services']
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (data && data[0]) {
      const keys = Object.keys(data[0])
      console.log(`Table ${t} columns:`, keys.filter(k => k.includes('stat')))
    }
  }
}
checkAllStatusCols()
