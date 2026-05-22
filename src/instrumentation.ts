export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');
    const { runDatabaseBackup, runWeeklyStatsReport } = await import('@/lib/cronJobs');

    console.log('--------------------------------------------------');
    console.log('[DRONEK AUTOMATION] Initializing local cron jobs...');
    console.log('--------------------------------------------------');

    // Trigger an initial backup on startup to verify it is working
    void runDatabaseBackup(true);

    // Schedule database backup daily at midnight (00:00)
    cron.schedule('0 0 * * *', () => {
      console.log('[Cron] Running scheduled daily SQLite database backup...');
      void runDatabaseBackup(false);
    });

    // Schedule weekly statistics report every Monday at 9:00 AM
    cron.schedule('0 9 * * 1', () => {
      console.log('[Cron] Running scheduled weekly stats report...');
      void runWeeklyStatsReport();
    });

    console.log('[DRONEK AUTOMATION] Local cron jobs successfully scheduled.');
  }
}
