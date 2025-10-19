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
    last_daily TEXT DEFAULT '',
    last_work INTEGER DEFAULT 0
  )
`);

/**
 * Creates the 'profiles' table if it doesn't exist
 */
await db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    user_id TEXT PRIMARY KEY,
    bio TEXT DEFAULT '',
    bg_color TEXT DEFAULT '#2c2f33',
    bg_image TEXT DEFAULT '',
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

/**
 * Represents a user's profile in the database
 * @typedef {Object} Profile
 * @property {string} bio - User's profile biography
 * @property {string} bg_color - User's profile background color
 * @property {string} bg_image - User's profile image background
 */
export interface Profile {
  bio: string;
  bg_color: string;
  bg_image?: string;
}

/**
 * Represents a user in the database
 * @typedef {Object} User
 * @property {string} id - Unique identifier for the user
 * @property {number} balance - User's current balance
 * @property {number} invested - Amount of money invested by the user
 * @property {string} last_daily - Date of the last daily reward
 * @property {number} last_work - Date of the last work action
 */
export interface User {
  id: string;
  balance: number;
  invested: number;
  last_daily: string;
  last_work: number;
  profile: Profile;
}

/**
 * Retrieves a user from the database or creates a new one if it doesn't exist
 * @param {string} userId - ID of the user
 * @returns {Promise<User>} The user object
 */
export async function getUser(userId: string): Promise<User> {
  let user = await db.get('SELECT * FROM users WHERE id = ?', userId);
  if (!user) {
    await db.run(
      "INSERT INTO users (id, balance, invested, last_daily, last_work) VALUES (?, 0, 0, '', 0)",
      userId
    );
    user = {
      id: userId,
      balance: 0,
      invested: 0,
      last_daily: '',
      last_work: 0,
    };
  }

  let profile = await db.get(
    'SELECT * FROM profiles WHERE user_id = ?',
    userId
  );
  if (!profile) {
    await db.run(
      "INSERT INTO profiles (user_id, bio, bg_color, bg_image) VALUES (?, '', '#2c2f33', '')",
      userId
    );
    profile = {
      bio: '',
      bg_color: '#2c2f33',
      bg_image: '',
    };
  }

  return { ...user, profile };
}

/**
 * Returns all users in the db
 * @returns {Promise<User[]>}
 */
export async function getAllUsers(): Promise<User[]> {
  return await db.all('SELECT * FROM users');
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

/**
 * Updates the last work date for a user
 * @param {string} userId - ID of the user
 * @param {string} dateString - New last work date
 * @returns {Promise<void>}
 */
export async function updateLastWork(
  userId: string,
  date: number
): Promise<void> {
  await db.run('UPDATE users SET last_work = ? WHERE id = ?', date, userId);
}

/**
 * Updates the biography for a user profile
 * @param {string} userId - ID of the user
 * @param {string} newBio - New user bio
 * @returns {Promise<void>}
 */
export async function updateBio(userId: string, newBio: string): Promise<void> {
  await db.run('UPDATE profiles SET bio = ? WHERE user_id = ?', newBio, userId);
}

/**
 * Updates the background color for a user's profile
 * @param {string} userId - ID of the user
 * @param {string} newColor - New background color (HEX or name)
 */
export async function updateBgColor(
  userId: string,
  newColor: string
): Promise<void> {
  await db.run(
    'UPDATE profiles SET bg_color = ? WHERE user_id = ?',
    newColor,
    userId
  );
}

/**
 * Updates the background image URL for a user's profile
 * @param {string} userId - ID of the user
 * @param {string} imageUrl - New background image URL
 */
export async function updateBgImage(
  userId: string,
  imageUrl: string
): Promise<void> {
  await db.run(
    'UPDATE profiles SET bg_image = ? WHERE user_id = ?',
    imageUrl,
    userId
  );
}
