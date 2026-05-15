require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function deleteTestRow() {
  const { data, error } = await supabase
    .from('production_sites')
    .delete()
    .eq('nom', 'Test Site');

  if (error) {
    console.error("Error:", error.message);
  } else {
    console.log("Deleted test row.");
  }
}

deleteTestRow();
