import type sqlite3 from 'sqlite3';
import type { Database } from 'sqlite';

export async function runMigrations(db: Database<sqlite3.Database, sqlite3.Statement>) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      balance INTEGER DEFAULT 0,
      bank INTEGER DEFAULT 0,
      last_daily TEXT DEFAULT '',
      last_work INTEGER DEFAULT 0,
      starting_claimed INTEGER DEFAULT 0
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS profiles (
      user_id TEXT PRIMARY KEY,
      bio TEXT DEFAULT '',
      bg_color TEXT DEFAULT '#2c2f33',
      bg_image TEXT DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
}
