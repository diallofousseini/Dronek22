
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function getColumns() {
  console.log('Querying columns for contacts table...')
  // This might fail if the user doesn't have permissions to information_schema via RPC or REST
  // But worth a try if we can run raw SQL via a known function or just guess
  
  // Alternatively, try to insert a record with various possible phone column names
  const testNames = ['phone', 'telephone', 'phone_number', 'mobile', 'contact_number']
  
  for (const name of testNames) {
    console.log(`Testing column name: ${name}`)
    const { error } = await supabase
      .from('contacts')
      .insert([{ [name]: 'test' }])
      .select()
    
    if (error) {
      console.log(`❌ ${name} failed: ${error.message}`)
    } else {
      console.log(`✅ ${name} exists!`)
      // Clean up if necessary, but it's just a test record
      return
    }
  }
}

getColumns()
