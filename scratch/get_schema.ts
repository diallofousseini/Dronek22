
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getFullSchema() {
  console.log('Fetching all column names for contacts...')
  // We can use RPC to run arbitrary SQL if 'exec_sql' exists, but usually it doesn't.
  // Instead, let's try to fetch a record that we know exists (the one I just created)
  // and see all keys.
  
  const { data, error } = await supabase.from('contacts').select('*')
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('All records:', JSON.stringify(data, null, 2))
    if (data.length > 0) {
      console.log('Columns in first record:', Object.keys(data[0]))
    }
  }
}

getFullSchema()
