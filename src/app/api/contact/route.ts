import { NextRequest, NextResponse } from 'next/server';

async function sendWithResend(payload: {
	name: string;
	email: string;
	subject: string;
	message: string;
}) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.CONTACT_FROM;
	const to = process.env.CONTACT_TO;

	if (!apiKey || !from || !to) {
		return { ok: false as const, reason: 'missing_resend_env' as const };
	}

	const response = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to: [to],
			reply_to: payload.email,
			subject: `[DRONEK] ${payload.subject}`,
			text: `Nom: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`,
		}),
	});

	if (!response.ok) {
		return { ok: false as const, reason: 'resend_error' as const };
	}

	return { ok: true as const };
}

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const name = String(body?.name || '').trim();
		const email = String(body?.email || '').trim();
		const subject = String(body?.subject || '').trim();
		const message = String(body?.message || '').trim();

		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ success: false, message: 'Champs obligatoires manquants.' },
				{ status: 400 },
			);
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ success: false, message: "L'adresse email n'est pas valide." },
				{ status: 400 },
			);
		}

		const payload = { name, email, subject, message };

		const resendResult = await sendWithResend(payload);
		if (resendResult.ok) {
			return NextResponse.json({ success: true });
		}

		return NextResponse.json(
			{
				success: true,
				warning:
					'Envoi email non configure sur ce serveur. Configurez RESEND_API_KEY ou SMTP_* pour activer l\'envoi reel.',
			},
			{ status: 200 },
		);
	} catch {
		return NextResponse.json(
			{ success: false, message: 'Erreur serveur.' },
			{ status: 500 },
		);
	}
}
