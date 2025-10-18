import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
});

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    last_daily TEXT DEFAULT ''
  )
`);

export interface User {
  id: string;
  balance: number;
  last_daily: string;
}

export async function getUser(userId: string): Promise<User> {
  let user = await db.get<User>('SELECT * FROM users WHERE id = ?', userId);
  if (!user) {
    await db.run(
      "INSERT INTO users (id, balance, last_daily) VALUES (?, 0, '')",
      userId
    );
    user = { id: userId, balance: 0, last_daily: '' };
  }
  return user;
}

export async function addBalance(
  userId: string,
  amount: number
): Promise<void> {
  await db.run(
    'UPDATE users SET balance = balance + ? WHERE id = ?',
    amount,
    userId
  );
}

export async function removeBalance(
  userId: string,
  amount: number
): Promise<void> {
  await db.run(
    'UPDATE users SET balance = balance - ? WHERE id = ?',
    amount,
    userId
  );
}

export async function updateLastDaily(
  userId: string,
  dateString: string
): Promise<void> {
  await db.run(
    'UPDATE users SET last_daily = ? WHERE id = ?',
    dateString,
    userId
  );
}
