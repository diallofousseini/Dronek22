import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic execution to bypass Vercel data caching
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    // 1. Security Check: verify the Authorization header if CRON_SECRET is configured
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.warn('[Cron Supabase Ping] Unauthorized access attempt blocked.');
      return new Response('Unauthorized', { status: 401 });
    }

    // 2. Heartbeat Query: Perform a quick, light read on the services table to keep Supabase awake
    const { data, error } = await supabase
      .from('services')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[Cron Supabase Ping] Database error during heartbeat check:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    console.log('[Cron Supabase Ping] Database pinged successfully. Supabase is awake.');
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      active: true,
      hasData: !!data
    });
  } catch (error: any) {
    console.error('[Cron Supabase Ping] Exception occurred during database ping:', error);
    return NextResponse.json(
      { success: false, error: error.message || String(error) },
      { status: 500 }
    );
  }
}
