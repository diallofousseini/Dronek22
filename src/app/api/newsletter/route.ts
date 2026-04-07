import { NextRequest, NextResponse } from 'next/server';

interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  language: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, language = 'fr' } = await request.json();
    
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: language === 'fr' ? 'Veuillez fournir une adresse email valide.' : 'Please provide a valid email address.' },
        { status: 400 }
      );
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: language === 'fr' ? 'L\'adresse email n\'est pas valide.' : 'The email address is not valid.' },
        { status: 400 }
      );
    }
    
    // In production, this would save to a database and send a confirmation email via SMTP
    // For now, we simulate a successful subscription
    console.log(`[Newsletter] New subscriber: ${email} (${language})`);
    
    return NextResponse.json({
      success: true,
      message: language === 'fr' 
        ? 'Merci pour votre inscription ! Vous recevrez bientôt un email de confirmation.' 
        : 'Thank you for subscribing! You will receive a confirmation email shortly.',
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { success: false, message: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}
