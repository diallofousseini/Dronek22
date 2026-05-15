
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function inspectContacts() {
  console.log('Inspecting contacts table...')
  const { data, error } = await supabase.from('contacts').select('*').limit(1)
  
  if (error) {
    console.error('Error fetching contacts:', error)
  } else {
    console.log('Contacts record sample:', data)
    if (data && data.length > 0) {
      console.log('Available columns:', Object.keys(data[0]))
    } else {
      console.log('No data in contacts table to inspect columns.')
      // Try to get column info from rpc or just check if table exists
      const { data: tableInfo, error: tableError } = await supabase
        .from('contacts')
        .select()
        .limit(0)
      if (tableError) {
        console.error('Table error:', tableError)
      } else {
        console.log('Table exists.')
      }
    }
  }
}

inspectContacts()
