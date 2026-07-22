import crypto from 'crypto';
import { supabase } from '@/lib/supabase';
import { db } from '@/lib/db';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === verifyHash;
}

export async function isRecognizedEmail(email: string): Promise<boolean> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return false;

  const adminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'tall3333333333@gmail.com').trim().toLowerCase();
  if (cleanEmail === adminEmail) return true;

  // Check config email
  try {
    const { data: config } = await supabase
      .from('contacts')
      .select('*')
      .eq('sujet', 'Configuration')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    const configEmail = config?.email ? String(config.email).trim().toLowerCase() : 'contact@dronek.ci';
    if (cleanEmail === configEmail) return true;
  } catch (e) {
    console.error('Error fetching contact config in isRecognizedEmail:', e);
  }

  // Check if email exists in any record of contacts table
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('email')
      .eq('email', cleanEmail)
      .limit(1);
    if (!error && data && data.length > 0) return true;
  } catch (e) {
    console.error('Error checking contacts table in isRecognizedEmail:', e);
  }

  // Check SQLite db (Prisma User table)
  try {
    const user = await db.user.findUnique({
      where: { email: cleanEmail },
      select: { email: true }
    });
    if (user) return true;
  } catch (e) {
    console.error('Error checking SQLite user in isRecognizedEmail:', e);
  }

  return false;
}

