import { getDb } from '../database/connection.ts';
import type { ProfileRow } from '../types/database.ts';

export async function getProfileRow(userId: string): Promise<ProfileRow | undefined> {
  const db = getDb();
  return db.get<ProfileRow>('SELECT * FROM profiles WHERE user_id = ?', userId);
}

export async function createProfileRow(userId: string): Promise<void> {
  const db = getDb();
  await db.run(
    "INSERT INTO profiles (user_id, bio, bg_color, bg_image) VALUES (?, '', '#2c2f33', '')",
    userId
  );
}

export async function updateBio(userId: string, newBio: string): Promise<void> {
  const db = getDb();
  await db.run('UPDATE profiles SET bio = ? WHERE user_id = ?', newBio, userId);
}

export async function updateBgColor(userId: string, newColor: string): Promise<void> {
  const db = getDb();
  await db.run('UPDATE profiles SET bg_color = ? WHERE user_id = ?', newColor, userId);
}

export async function updateBgImage(userId: string, imageUrl: string): Promise<void> {
  const db = getDb();
  await db.run('UPDATE profiles SET bg_image = ? WHERE user_id = ?', imageUrl, userId);
}
