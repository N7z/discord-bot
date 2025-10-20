import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

let dbInstance: Database<sqlite3.Database, sqlite3.Statement> | null = null;

export async function initDatabase(dbPath: string = './database.sqlite') {
  if (dbInstance) return dbInstance;

  dbInstance = await open({ filename: dbPath, driver: sqlite3.Database });

  await dbInstance.exec('PRAGMA foreign_keys = ON;');
  await dbInstance.exec("PRAGMA journal_mode = WAL;");
  await dbInstance.exec('PRAGMA synchronous = NORMAL;');
  await dbInstance.exec('PRAGMA busy_timeout = 5000;');

  return dbInstance;
}

export function getDb() {
  if (!dbInstance) throw new Error('Database not initialized. Call initDatabase() first.');
  return dbInstance;
}
