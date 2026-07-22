import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPassword, isRecognizedEmail } from '@/lib/authCrypto';

async function getContactConfig() {
  try {
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('sujet', 'Configuration')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    return data;
  } catch (e) {
    console.error('Error fetching contact config:', e);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    // Check if the email is recognized in the database
    const recognized = await isRecognizedEmail(email);

    if (recognized) {
      // 1. Check general password
      const generalPassword = 'sitedronek@2026';
      if (password === generalPassword) {
        return NextResponse.json({ success: true, mockAuth: true });
      }

      // 2. Check if there is an overridden password stored in Supabase contacts
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

      // 3. Fall back to master password
      const masterPassword = 'f75Y0&5H04@';
      if (password === masterPassword) {
        return NextResponse.json({ success: true, mockAuth: true });
      }
    }

    // If it's not a recognized email or credentials didn't match, tell the client to try Supabase auth
    return NextResponse.json({ success: false, fallbackToSupabase: true });
  } catch (err: any) {
    console.error('Error in login api:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
