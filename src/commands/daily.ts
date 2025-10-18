import { getUser, addBalance, updateLastDaily } from '../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['diario'];

export async function daily(msg: Message) {
  const userId = msg.author.id;
  const now = new Date();

  const user = await getUser(userId);

  const today = now.toISOString().split('T')[0] ?? ''; // YYYY-MM-DD format
  if (user.last_daily === today)
    return msg.reply('⏳ | Você já pegou o daily hoje! Volte amanhã.');

  const reward = 100;
  await addBalance(userId, reward);
  await updateLastDaily(userId, today);

  msg.reply(`🎁 | Você recebeu ${reward} Guigacoins!`);
}
