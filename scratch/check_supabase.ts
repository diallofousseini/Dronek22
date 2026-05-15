
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tzjymsirqbscddbpbjed.supabase.co'
const supabaseAnonKey = 'sb_publishable_daYlI4r5x75duYObyHy-Cw_X4bNXPoV'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function checkData() {
  const { data: projets, error: ep } = await supabase.from('projets').select('*')
  console.log('Projets:', projets?.length, ep || '')
  
  const { data: actualites, error: ea } = await supabase.from('actualites').select('*')
  console.log('Actualités:', actualites?.length, ea || '')

  const { data: services, error: es } = await supabase.from('services').select('*')
  console.log('Services:', services?.length, es || '')
}

checkData()
