import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword } from '@/lib/authCrypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com').toLowerCase();
    const masterPassword = 'f75Y0&5H04@';

    if (email === adminEmail) {
      // 1. Check if there is an overridden password stored in Supabase contacts
      const { data: records, error } = await supabase
        .from('contacts')
        .select('*')
        .eq('sujet', 'AdminPasswordOverride')
        .eq('email', email);

      if (!error && records && records.length > 0) {
        const storedHash = records[0].message;
        const isValid = verifyPassword(password, storedHash);
        if (isValid) {
          return NextResponse.json({ success: true, mockAuth: true });
        }
      }

      // 2. Fall back to master password
      if (password === masterPassword) {
        return NextResponse.json({ success: true, mockAuth: true });
      }
    }

    // If it's not the admin email or credentials didn't match, tell the client to try Supabase auth
    return NextResponse.json({ success: false, fallbackToSupabase: true });
  } catch (err: any) {
    console.error('Error in login api:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
