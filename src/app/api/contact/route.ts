import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase } from '@/lib/supabase';

async function getCompanyEmail(): Promise<string> {
	try {
		const { data, error } = await supabase
			.from('contacts')
			.select('email')
			.eq('sujet', 'Configuration')
			.order('created_at', { ascending: false })
			.limit(1)
			.maybeSingle();
		
		if (!error && data?.email) {
			const emailStr = String(data.email).trim();
			if (emailStr) {
				return emailStr;
			}
		}
	} catch (err) {
		console.error('Error fetching company email from Supabase config:', err);
	}
	return process.env.CONTACT_TO || 'contact@dronek.ci';
}

async function sendWithResend(
	payload: {
		name: string;
		email: string;
		subject: string;
		message: string;
	},
	toEmail: string
) {
	const apiKey = process.env.RESEND_API_KEY;
	const from = process.env.CONTACT_FROM || 'no-reply@dronek.ci';

	if (!apiKey) {
		return { ok: false as const, reason: 'missing_resend_env' as const };
	}

	try {
		// 1. Send Admin Alert Email
		const responseAdmin = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				from,
				to: [toEmail],
				reply_to: payload.email,
				subject: `[DRONEK Admin] Nouveau message: ${payload.subject}`,
				text: `Nom: ${payload.name}\nEmail: ${payload.email}\nSujet: ${payload.subject}\n\n${payload.message}`,
			}),
		});

		if (!responseAdmin.ok) {
			const adminText = await responseAdmin.text();
			console.error('Resend Admin Alert Error:', {
				status: responseAdmin.status,
				body: adminText,
			});
			return { ok: false as const, reason: 'admin_send_failed' as const };
		}

		// 2. Send Client Confirmation Email (Optional/Non-blocking)
		try {
			const responseClient = await fetch('https://api.resend.com/emails', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					from,
					to: [payload.email],
					subject: `[DRONEK] Confirmation de votre message`,
					text: `Bonjour ${payload.name},\n\nNous avons bien reçu votre message concernant "${payload.subject}" et nous vous en remercions.\nNotre équipe vous contactera dans les plus brefs délais.\n\nMessage envoyé :\n"${payload.message}"\n\nCordialement,\nL'équipe DRONEK SARL\nhttps://dronek.ci`,
				}),
			});

			if (!responseClient.ok) {
				const clientText = await responseClient.text();
				console.warn('Resend Client Confirmation Warning (Non-blocking):', {
					status: responseClient.status,
					body: clientText,
				});
			}
		} catch (clientErr) {
			console.warn('Error sending Client Confirmation email (Non-blocking):', clientErr);
		}

		return { ok: true as const };
	} catch (err) {
		console.error('Error sending with Resend:', err);
		return { ok: false as const, reason: 'resend_exception' as const };
	}
}

function logEmailLocally(
	payload: {
		name: string;
		email: string;
		subject: string;
		message: string;
	},
	toEmail: string
) {
	try {
		const from = process.env.CONTACT_FROM || 'no-reply@dronek.ci';
		const logDir = path.resolve(process.cwd(), 'logs/sent_emails');

		if (!fs.existsSync(logDir)) {
			fs.mkdirSync(logDir, { recursive: true });
		}

		const cleanDate = new Date().toISOString().replace(/:/g, '-');
		const logFilePath = path.resolve(logDir, `email_${cleanDate}.json`);

		const emailData = {
			sentAt: new Date().toISOString(),
			adminAlert: {
				from,
				to: toEmail,
				replyTo: payload.email,
				subject: `[DRONEK Admin] Nouveau message: ${payload.subject}`,
				text: `Nom: ${payload.name}\nEmail: ${payload.email}\nSujet: ${payload.subject}\n\n${payload.message}`,
			},
			clientConfirmation: {
				from,
				to: payload.email,
				subject: `[DRONEK] Confirmation de votre message`,
				text: `Bonjour ${payload.name},\n\nNous avons bien reçu votre message concernant "${payload.subject}" et nous vous en remercions.\nNotre équipe vous contactera dans les plus brefs délais.\n\nMessage envoyé :\n"${payload.message}"\n\nCordialement,\nL'équipe DRONEK SARL\nhttps://dronek.ci`,
			}
		};

		fs.writeFileSync(logFilePath, JSON.stringify(emailData, null, 2));
		console.log(`[Email Simulation] Local email log saved to: ${logFilePath}`);
		return true;
	} catch (err) {
		console.error('Error logging email locally:', err);
		return false;
	}
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

		// Fetch the company's active email from database config (falls back to process.env.CONTACT_TO)
		const toEmail = await getCompanyEmail();

		// Always log locally in development mode or if Resend is not configured
		const isDev = process.env.NODE_ENV === 'development';
		const hasResend = !!process.env.RESEND_API_KEY;

		if (isDev || !hasResend) {
			logEmailLocally(payload, toEmail);
		}

		if (hasResend) {
			const resendResult = await sendWithResend(payload, toEmail);
			if (resendResult.ok) {
				return NextResponse.json({ success: true });
			}
		}

		return NextResponse.json(
			{
				success: true,
				warning:
					'Envoi e-mail simulé en local. Les fichiers de simulation ont été enregistrés dans logs/sent_emails/ (Configurez RESEND_API_KEY pour activer l\'envoi réel).',
			},
			{ status: 200 },
		);
	} catch (err) {
		console.error('API Contact Error:', err);
		return NextResponse.json(
			{ success: false, message: 'Erreur serveur.' },
			{ status: 500 },
		);
	}
}
