import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTP } from '@/lib/sms';
import { isRecognizedEmail } from '@/lib/authCrypto';

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

function obfuscatePhoneNumber(phoneStr: string): string {
  const cleaned = phoneStr.trim();
  // If it's a typical +225 number or similar split by spaces or slashes
  if (cleaned.includes('+')) {
    const parts = cleaned.replace(/[\/\n]/g, ' ').replace(/\s+/g, ' ').split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} •• •• ${parts[parts.length - 1]}`;
    }
  }
  if (cleaned.length > 8) {
    return `${cleaned.slice(0, 7)} •• •• ${cleaned.slice(-4)}`;
  }
  return '•• •• •• ••';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: 'Adresse email requise.' }, { status: 400 });
    }

    // Check if the email is recognized in the database
    const recognized = await isRecognizedEmail(email);

    if (!recognized) {
      return NextResponse.json({ error: 'Adresse email non autorisée.' }, { status: 400 });
    }

    // Fetch dynamic coordinates from the site's Configuration row
    const config = await getContactConfig();

    // Determine target phone number from active configuration
    const configPhone = config?.telephone ? String(config.telephone).trim() : '+225 07 07 73 22 64';
    
    // Parse first phone number E.164-style for Twilio API
    const rawNum = configPhone.split(/[\/\n]/)[0].trim();
    const cleanedPhone = rawNum.startsWith('+') 
      ? '+' + rawNum.replace(/\D/g, '') 
      : rawNum.replace(/\D/g, '');

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
    await sendOTP(otpCode, cleanedPhone, email);

    // Obfuscate active phone number for UI display
    const obfuscatedPhone = obfuscatePhoneNumber(rawNum);

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
