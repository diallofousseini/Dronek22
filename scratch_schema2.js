require('dotenv').config({ path: '.env.local' });

async function fetchSchema() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/';
  try {
    const res = await fetch(url, {
      headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }
    });
    const data = await res.json();
    console.log(Object.keys(data.definitions || {}));
  } catch(e) { console.error(e.message); }
}
fetchSchema();
