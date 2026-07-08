export async function sendOTP(code: string, phone: string, email: string) {
  console.log(`[OTP SERVICE] Generated OTP code: ${code} for phone: ${phone} (Email: ${email})`);
  
  const twilioSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioFrom = process.env.TWILIO_FROM;

  if (twilioSid && twilioAuthToken && twilioFrom) {
    try {
      const auth = Buffer.from(`${twilioSid}:${twilioAuthToken}`).toString('base64');
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          To: phone,
          From: twilioFrom,
          Body: `Votre code de sécurité DRONEK est : ${code}. Il expire dans 5 minutes.`
        })
      });

      if (response.ok) {
        console.log(`[OTP SERVICE] SMS sent successfully via Twilio API to ${phone}`);
      } else {
        const errorText = await response.text();
        console.error(`[OTP SERVICE] Twilio API error: ${errorText}`);
      }
    } catch (err) {
      console.error('[OTP SERVICE] Failed to send SMS via Twilio API:', err);
    }
  }

  // Fallback: Send email via Resend to ensure the admin can retrieve it during testing/development
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM || 'no-reply@dronek.ci',
          to: [email, 'diallofousseini14@gmail.com'],
          subject: 'Code OTP de récupération - DRONEK',
          html: `
            <div style="font-family: sans-serif; padding: 24px; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 16px;">
              <h2 style="color: #14532d; font-size: 20px; font-weight: bold; text-transform: uppercase;">DRONEK Administration</h2>
              <p>Bonjour,</p>
              <p>Voici votre code de sécurité unique (OTP) pour réinitialiser votre mot de passe :</p>
              <div style="background-color: #f7fbf8; border: 1px dashed #14532d; padding: 16px; text-align: center; margin: 24px 0; border-radius: 8px;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 6px; color: #14532d;">${code}</span>
              </div>
              <p style="color: #64748b; font-size: 13px;">Ce code est valide pendant 5 minutes et ne peut être utilisé qu'une seule fois.</p>
              <p style="color: #64748b; font-size: 13px;">Code envoyé également par SMS au numéro associé : ${phone.replace(/(\d{2})(\d{2})(\d{2})/, '$1 •• •• $3')}</p>
            </div>
          `
        })
      });

      if (response.ok) {
        console.log(`[OTP SERVICE] OTP email sent successfully via Resend API to ${email}`);
      } else {
        const errorText = await response.text();
        console.error(`[OTP SERVICE] Resend API error: ${errorText}`);
      }
    } catch (err) {
      console.error('[OTP SERVICE] Failed to send OTP email via Resend API:', err);
    }
  }
}
