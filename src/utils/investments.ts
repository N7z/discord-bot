import { addInvested, db } from './database.ts';

export async function calculateInvestments(): Promise<void> {
  const users = await db.all('SELECT * FROM users');
  for (const user of users) {
    const profit = Math.floor(user.invested * 0.005); // 0.5% de lucro
    if (profit > 0) {
      addInvested(user.id, profit);
    }
  }
}
