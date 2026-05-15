
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkMore() {
  const cols = ['localisation', 'categorie']
  for (const c of cols) {
    const { error } = await supabase.from('contacts').insert([{ [c]: 'test' }]).select()
    if (!error) console.log(`✅ ${c}: EXISTS`)
    else console.log(`❌ ${c}: ${error.message}`)
  }
}
checkMore()
