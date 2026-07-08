import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTP } from '@/lib/sms';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Adresse email requise.' }, { status: 400 });
    }

    const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com').toLowerCase();
    const officialEmail = 'contact@dronek.ci';

    // Verify if it is the authorized admin email
    if (email !== adminEmail && email !== officialEmail) {
      return NextResponse.json({ error: 'Adresse email non autorisée.' }, { status: 400 });
    }

    // Generate a 6-digit OTP code
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Delete any existing OTP entries in contacts table under subject 'AdminOTP'
    await supabase
      .from('contacts')
      .delete()
      .eq('sujet', 'AdminOTP')
      .eq('email', email);

    // Save the new OTP code in contacts table
    const { error: insertError } = await supabase
      .from('contacts')
      .insert({
        nom: 'System',
        prenom: 'OTP',
        email: email,
        sujet: 'AdminOTP',
        message: JSON.stringify({ code: otpCode, expiresAt, attempts: 0 }),
      });

    if (insertError) {
      console.error('Error saving OTP to Supabase:', insertError);
      return NextResponse.json({ error: 'Erreur lors de la génération du code de sécurité.' }, { status: 500 });
    }

    // Trigger SMS and email send via sendOTP helper
    const adminPhone = '+2250707732264'; // Official number
    await sendOTP(otpCode, adminPhone, email);

    // Obfuscate phone number for UI display
    const obfuscatedPhone = '+225 07 •• •• 22 64';

    return NextResponse.json({
      success: true,
      message: 'Code de sécurité généré avec succès.',
      phone: obfuscatedPhone,
    });
  } catch (err: any) {
    console.error('Error in send OTP api:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
