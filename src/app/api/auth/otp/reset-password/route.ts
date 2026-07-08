import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { hashPassword } from '@/lib/authCrypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const token = String(body?.token || '').trim();
    const password = String(body?.password || '');

    if (!email || !token || !password) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    // Retrieve the reset token
    const { data: records, error: fetchError } = await supabase
      .from('contacts')
      .select('*')
      .eq('sujet', 'AdminResetToken')
      .eq('email', email);

    if (fetchError || !records || records.length === 0) {
      return NextResponse.json({ error: 'Session de réinitialisation expirée ou inexistante.' }, { status: 400 });
    }

    const record = records[0];
    let tokenData;
    try {
      tokenData = JSON.parse(record.message);
    } catch (e) {
      return NextResponse.json({ error: 'Session corrompue.' }, { status: 400 });
    }

    const { token: savedToken, expiresAt } = tokenData;

    // Check expiration
    if (Date.now() > expiresAt) {
      await supabase.from('contacts').delete().eq('id', record.id);
      return NextResponse.json({ error: 'Session expiré. Veuillez générer un nouveau code OTP.' }, { status: 400 });
    }

    // Verify token matches
    if (token !== savedToken) {
      return NextResponse.json({ error: 'Session non autorisée.' }, { status: 400 });
    }

    // Password strength verification
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-]/.test(password);

    if (password.length < minLength || !hasUppercase || !hasLowercase || !hasDigit || !hasSpecialChar) {
      return NextResponse.json({
        error: 'Le mot de passe doit comporter au moins 8 caractères, incluant au moins une majuscule, une minuscule, un chiffre et un caractère spécial.'
      }, { status: 400 });
    }

    // Hash the password using our crypto utility
    const hashedPassword = hashPassword(password);

    // Save the new hashed password in contacts table under 'AdminPasswordOverride'
    // First, delete any existing override
    await supabase
      .from('contacts')
      .delete()
      .eq('sujet', 'AdminPasswordOverride')
      .eq('email', email);

    // Store the updated password
    const { error: insertError } = await supabase
      .from('contacts')
      .insert({
        nom: 'System',
        prenom: 'Admin',
        email: email,
        sujet: 'AdminPasswordOverride',
        message: hashedPassword,
      });

    if (insertError) {
      console.error('Error storing overridden password:', insertError);
      return NextResponse.json({ error: 'Erreur lors de la sauvegarde du nouveau mot de passe.' }, { status: 500 });
    }

    // Delete the used reset token (clean up!)
    await supabase.from('contacts').delete().eq('id', record.id);

    return NextResponse.json({
      success: true,
      message: 'Votre mot de passe a été modifié avec succès.'
    });
  } catch (err: any) {
    console.error('Error in reset password api:', err);
    return NextResponse.json({ error: 'Erreur interne du serveur.' }, { status: 500 });
  }
}
