
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function dumpContacts() {
  const { data, error } = await supabase.from('contacts').select('*')
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('Contacts Data:', JSON.stringify(data, null, 2))
  }
}

dumpContacts()
