
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import path from 'path'

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function cleanup() {
  const testIds = [
    '2404dc92-a768-40dd-b856-e3283da886ae',
    '5197cf76-a15c-4af7-a40c-9ecfb8ae5728',
    'ab8e1d11-b9df-4f68-b897-6540d5f00d94'
  ]
  console.log('Cleaning up test records...')
  const { error } = await supabase.from('contacts').delete().in('id', testIds)
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('✅ Cleanup successful!')
  }
}

cleanup()
