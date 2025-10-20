import { addBank, getAllUsers } from './database.ts';

export async function calculateInvestments(): Promise<void> {
  const users = await getAllUsers();
  for (const user of users) {
    const profit = Math.floor(user.bank * 0.005); // 0.5% de lucro
    if (profit > 0) {
      addBank(user.id, profit);
    }
  }
}
