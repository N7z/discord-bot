import { getUser, addBalance, updateLastDaily } from '../../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['diario'];

export async function daily(msg: Message) {
  const userId = msg.author.id;
  const now = new Date();

  const user = await getUser(userId);

  const today = now.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD

  const [lastDateRaw, lastStreakRaw] = (user.last_daily || '').split('|'); // YYYY-MM-DD|streak
  const lastDate = lastDateRaw || '';
  const prevStreak =
    Number.isFinite(Number(lastStreakRaw)) && Number(lastStreakRaw) > 0
      ? Number(lastStreakRaw)
      : lastDate
      ? 1
      : 0;

  if (lastDate === today) {
    return msg.reply('⏳ | Você já pegou o daily hoje! Volte amanhã.');
  }

  const yesterdayDate = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
  );
  const yesterday = yesterdayDate.toISOString().split('T')[0];

  const newStreak = lastDate === yesterday ? prevStreak + 1 : 1;

  const reward = 100 + prevStreak * 10;
  await addBalance(userId, reward);
  await updateLastDaily(userId, `${today}|${newStreak}`);

  msg.reply(
    `🎁 | Você recebeu **${reward} Guigacoins**! 🔥 Streak diário: **${newStreak}**`
  );
}
