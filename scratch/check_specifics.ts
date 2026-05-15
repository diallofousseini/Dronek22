
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSpecifics() {
  const tables = ['projets', 'actualites', 'production_sites']
  for (const t of tables) {
    const { data, error } = await supabase.from(t).select('*').limit(1)
    if (error) {
       console.log(`Error ${t}: ${error.message}`)
    } else if (data && data[0]) {
      console.log(`Table ${t} keys:`, Object.keys(data[0]))
    } else {
      console.log(`Table ${t} is empty.`)
    }
  }
}
checkSpecifics()
