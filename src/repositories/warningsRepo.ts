import { getDb } from '../database/connection.ts';

export interface WarningRecord {
  id: number;
  user_id: string;
  moderator_id: string;
  reason: string;
  created_at: number;
}

export async function addWarning(userId: string, moderatorId: string, reason: string): Promise<void> {
  const db = getDb();
  const ts = Date.now();
  await db.run(
    'INSERT INTO warnings (user_id, moderator_id, reason, created_at) VALUES (?, ?, ?, ?)',
    userId,
    moderatorId,
    reason,
    ts
  );
}

export async function getWarnings(userId: string): Promise<WarningRecord[]> {
  const db = getDb();
  return db.all<WarningRecord[]>(
    'SELECT id, user_id, moderator_id, reason, created_at FROM warnings WHERE user_id = ? ORDER BY created_at DESC',
    userId
  );
}
