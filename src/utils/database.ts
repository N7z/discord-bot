import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

/**
 * Opens the SQLite database connection
 * @type {import('sqlite').Database}
 */
export const db = await open({
  filename: './database.sqlite',
  driver: sqlite3.Database,
});

/**
 * Creates the 'users' table if it doesn't exist
 */
await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    balance INTEGER DEFAULT 0,
    invested INTEGER DEFAULT 0,
    last_daily TEXT DEFAULT ''
  )
`);

/**
 * Represents a user in the database
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {number} balance - User's current balance
 * @property {number} invested - Amount of money invested by the user
 * @property {string} last_daily - Date of the last daily reward
 */
export interface User {
  id: string;
  balance: number;
  invested: number;
  last_daily: string;
}

/**
 * Retrieves a user from the database or creates a new one if it doesn't exist
 * @param {string} userId - ID of the user
 * @returns {Promise<User>} The user object
 */
export async function getUser(userId: string): Promise<User> {
  let user = await db.get<User>('SELECT * FROM users WHERE id = ?', userId);
  if (!user) {
    await db.run(
      "INSERT INTO users (id, balance, invested, last_daily) VALUES (?, 0, 0, '')",
      userId
    );
    user = { id: userId, balance: 0, invested: 0, last_daily: '' };
  }
  return user;
}

/**
 * Adds invested money to a user's account
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount to add to invested
 * @returns {Promise<void>}
 */
export async function addInvested(
  userId: string,
  amount: number
): Promise<void> {
  await db.run(
    'UPDATE users SET invested = invested + ? WHERE id = ?',
    amount,
    userId
  );
}

/**
 * Removes invested money from a user's account
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount to remove from invested
 * @returns {Promise<void>}
 */
export async function removeInvested(
  userId: string,
  amount: number
): Promise<void> {
  await db.run(
    'UPDATE users SET invested = invested - ? WHERE id = ?',
    amount,
    userId
  );
}

/**
 * Adds money to a user's balance
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount to add to balance
 * @returns {Promise<void>}
 */
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

/**
 * Removes money from a user's balance
 * @param {string} userId - ID of the user
 * @param {number} amount - Amount to remove from balance
 * @returns {Promise<void>}
 */
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

/**
 * Updates the last daily reward date for a user
 * @param {string} userId - ID of the user
 * @param {string} dateString - New last daily date
 * @returns {Promise<void>}
 */
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
