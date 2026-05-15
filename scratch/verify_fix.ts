
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function verifyFix() {
  console.log('Verifying fix with new payload structure...')
  
  // Simulated payload from CMS for a contact
  const payload = {
    email: 'verified@dronek.ci',
    telephone: '+225 00 00 00 00',
    statut: 'publie'
  }
  
  const { data, error } = await supabase
    .from('contacts')
    .upsert(payload)
    .select()
  
  if (error) {
    console.error('❌ Verification failed:', error.message)
  } else {
    console.log('✅ Verification successful! Data:', data)
  }
}

verifyFix()
