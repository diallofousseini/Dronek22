
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkSingular() {
  const { data, error } = await supabase.from('contact').select('*').limit(1)
  if (error) {
    console.log(`Table 'contact' error: ${error.message}`)
  } else {
    console.log(`Table 'contact' exists! Sample:`, data[0])
  }
}

checkSingular()
