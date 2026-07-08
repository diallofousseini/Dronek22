import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const otp = String(body?.otp || '').trim();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email et code OTP requis.' }, { status: 400 });
    }

    // Retrieve active OTP from Supabase contacts table
    const { data: records, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('sujet', 'AdminOTP')
      .eq('email', email);

    if (fetchError || !records || records.length === 0) {
      return NextResponse.json({ error: 'Aucun code OTP actif trouvé.' }, { status: 400 });
    }

    const record = records[0];
    let otpData;
    try {
      otpData = JSON.parse(record.message);
    } catch (e) {
      return NextResponse.json({ error: 'Code de sécurité corrompu.' }, { status: 400 });
    }

    const { code, expiresAt, attempts } = otpData;

    // Check expiration
    if (Date.now() > expiresAt) {
      // Delete the expired OTP
      await supabase.from('contacts').delete().eq('id', record.id);
      return NextResponse.json({ error: 'Code OTP expiré (valide 5 minutes). Veuillez en générer un nouveau.' }, { status: 400 });
    }

    // Check attempt limit (Anti-Bruteforce)
    if (attempts >= 3) {
      // Delete the blocked OTP
      await supabase.from('contacts').delete().eq('id', record.id);
      return NextResponse.json({ error: 'Trop de tentatives incorrectes (limite de 3 dépassée). Veuillez générer un nouveau code.' }, { status: 400 });
    }

    // Compare code
    if (otp !== code) {
      const newAttempts = attempts + 1;
      
      if (newAttempts >= 3) {
        await supabase.from('contacts').delete().eq('id', record.id);
        return NextResponse.json({ error: 'Code OTP incorrect. Trop de tentatives (limite de 3 dépassée). Veuillez générer un nouveau code.' }, { status: 400 });
      }

      // Update attempts count
      await supabase
        .from('contacts')
        .update({
          message: JSON.stringify({ code, expiresAt, attempts: newAttempts })
        })
        .eq('id', record.id);

      const remaining = 3 - newAttempts;
      return NextResponse.json({ error: `Code OTP incorrect. Tentatives restantes : ${remaining}` }, { status: 400 });
    }

    // OTP is correct! Generate a secure temporary reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes session

    // Delete the used OTP (single-use constraint!)
    await supabase.from('contacts').delete().eq('id', record.id);

    // Save reset token in contacts table
    await supabase
      .from('contacts')
      .delete()
      .eq('sujet', 'AdminResetToken')
      .eq('email', email);

    const { error: tokenError } = await supabase
      .from('contacts')
      .insert({
        nom: 'System',
        prenom: 'Token',
        email: email,
        sujet: 'AdminResetToken',
        message: JSON.stringify({ token: resetToken, expiresAt: tokenExpiresAt }),
      });

    if (tokenError) {
      console.error('Error saving reset token to Supabase:', tokenError);
      return NextResponse.json({ error: 'Erreur lors de la création de la session de réinitialisation.' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      token: resetToken,
      message: 'Code OTP validé avec succès.'
    });
  } catch (err: any) {
    console.error('Error in verify OTP api:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
