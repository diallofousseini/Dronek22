
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectConfig() {
  console.log('Inspecting contacts table for Configuration...')
  const { data, error } = await supabase.from('contacts').select('*').eq('category', 'Configuration')
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Data:', JSON.stringify(data, null, 2))
  }
}

inspectConfig()
