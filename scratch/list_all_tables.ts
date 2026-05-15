
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function listAllTables() {
  console.log('Listing all tables via RPC if possible, or just guessing more...')
  
  // Try to use a common RPC if it exists
  const { data, error } = await supabase.rpc('get_tables')
  if (error) {
    console.log('RPC get_tables not found. Trying another way...')
    // Try to query a view that might be exposed
    const { data: d2, error: e2 } = await supabase.from('pg_tables').select('tablename').eq('schemaname', 'public')
    if (e2) {
       console.log('pg_tables not accessible. Trying manual list...')
       const common = ['projets', 'actualites', 'equipe', 'contacts', 'production_sites', 'services', 'formations', 'testimonials', 'newsletter']
       for (const t of common) {
         const { error: te } = await supabase.from(t).select('id').limit(0)
         if (!te) console.log(`✅ Table ${t} exists`)
         else if (te.code !== 'PGRST204') console.log(`❌ Table ${t}: ${te.message} (Code: ${te.code})`)
       }
    } else {
      console.log('Tables:', d2)
    }
  } else {
    console.log('Tables:', data)
  }
}

listAllTables()
