import fs from 'fs';
import path from 'path';
import { db } from './db';

// Get clean YYYY-MM-DD_HH-mm-ss string
function getTimestampString(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const year = now.getFullYear();
  const month = pad(now.getMonth() + 1);
  const day = pad(now.getDate());
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export async function runDatabaseBackup(isManual = false): Promise<boolean> {
  try {
    const projectRoot = process.cwd();
    // Resolve SQLite database source path
    const dbSourcePath = path.resolve(projectRoot, 'prisma/db/custom.db');
    
    // Resolve Backup directory path
    const backupDir = path.resolve(projectRoot, 'backups');
    
    // Ensure backup directory exists
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    if (!fs.existsSync(dbSourcePath)) {
      console.warn(`[Backup Warning] SQLite database file not found at: ${dbSourcePath}`);
      return false;
    }

    const timestamp = getTimestampString();
    const backupFileName = `custom_backup_${timestamp}.db`;
    const dbDestPath = path.resolve(backupDir, backupFileName);

    // Perform the file copy
    fs.copyFileSync(dbSourcePath, dbDestPath);

    const logMessage = `[${new Date().toISOString()}] Backup created successfully: ${backupFileName} ${isManual ? '(Triggered manually/init)' : '(Scheduled)'}\n`;
    const logFilePath = path.resolve(backupDir, 'backup_log.txt');
    fs.appendFileSync(logFilePath, logMessage);

    console.log(`[Backup Success] ${logMessage.trim()}`);
    return true;
  } catch (error) {
    console.error('[Backup Error] Failed to backup SQLite database:', error);
    return false;
  }
}

export async function runWeeklyStatsReport(): Promise<void> {
  try {
    const projectRoot = process.cwd();
    const backupDir = path.resolve(projectRoot, 'backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Fetch some basic stats from Prisma
    let postCount = 0;
    try {
      postCount = await db.post.count();
    } catch {
      // In case DB is not fully ready yet
    }

    const timestamp = new Date().toISOString();
    const statsLog = `
=========================================
DRONEK - RAPPORT HEBDOMADAIRE (SIMULÉ)
Date: ${timestamp}
-----------------------------------------
Base de données locale (SQLite) :
- Nombre d'actualités (posts) : ${postCount}

Activité Système :
- Le plan de sitemap dynamique est actif.
- Les sauvegardes locales sont activées.
- Système de monitoring Sentry initialisé.
=========================================
`;

    const statsLogPath = path.resolve(backupDir, 'weekly_stats.log');
    fs.appendFileSync(statsLogPath, statsLog);
    
    console.log(`[Cron Task] Weekly report generated successfully at: ${statsLogPath}`);
  } catch (error) {
    console.error('[Cron Error] Failed to generate weekly statistics report:', error);
  }
}
