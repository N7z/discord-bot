import { getDb } from '../database/connection.ts';
import type { UserRow } from '../types/database.ts';

export async function getUserRow(userId: string): Promise<UserRow | undefined> {
  const db = getDb();
  return db.get<UserRow>('SELECT * FROM users WHERE id = ?', userId);
}

export async function createUserRow(userId: string): Promise<void> {
  const db = getDb();
  await db.run(
    "INSERT INTO users (id, balance, bank, last_daily, last_work) VALUES (?, 0, 0, '', 0)",
    userId
  );
}

export async function getAllUserRows(): Promise<UserRow[]> {
  const db = getDb();
  return db.all<UserRow[]>('SELECT * FROM users');
}

export async function addBank(userId: string, amount: number): Promise<void> {
  const db = getDb();
  await db.run('UPDATE users SET bank = bank + ? WHERE id = ?', amount, userId);
}

export async function removeBank(
  userId: string,
  amount: number
): Promise<void> {
  const db = getDb();
  await db.run('UPDATE users SET bank = bank - ? WHERE id = ?', amount, userId);
}

export async function addBalance(
  userId: string,
  amount: number
): Promise<void> {
  const db = getDb();
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
  const db = getDb();
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
  const db = getDb();
  await db.run(
    'UPDATE users SET last_daily = ? WHERE id = ?',
    dateString,
    userId
  );
}

export async function updateLastWork(
  userId: string,
  date: number
): Promise<void> {
  const db = getDb();
  await db.run('UPDATE users SET last_work = ? WHERE id = ?', date, userId);
}

export async function hasStartingClaimed(userId: string): Promise<boolean> {
  const db = getDb();
  const row = await db.get<{ claimed: number }>(
    'SELECT starting_claimed AS claimed FROM users WHERE id = ? ',
    userId
  );
  return !!row?.claimed;
}

export async function setStartingClaimed(userId: string): Promise<void> {
  const db = getDb();
  await db.run('UPDATE users SET starting_claimed = 1 WHERE id = ?', userId);
}
