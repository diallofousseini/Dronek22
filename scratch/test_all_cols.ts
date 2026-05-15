
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testAllPossibleColumns() {
  const columns = ['phone', 'telephone', 'titre', 'title', 'location', 'localisation', 'category', 'categorie', 'email']
  console.log('Testing columns on contacts table...')
  
  for (const col of columns) {
    const { error } = await supabase.from('contacts').insert([{ [col]: 'test' }]).select()
    if (error) {
      console.log(`❌ ${col}: ${error.message}`)
    } else {
      console.log(`✅ ${col}: EXISTS`)
    }
  }
}

testAllPossibleColumns()
