import { getUser, addBalance, updateLastDaily } from '../utils/database.ts';
import { Message } from 'discord.js';

export async function daily(msg: Message) {
  const userId = msg.author.id;
  const now = Date.now();

  const user = await getUser(userId);

  const diff = now - user.last_daily;
  if (diff < 24 * 60 * 60 * 1000)
    return msg.reply('⏳ Você já pegou o daily hoje!');

  const reward = 100;
  await addBalance(userId, reward);
  await updateLastDaily(userId, now);

  msg.reply(`🎁 Você recebeu ${reward} Guigacoins!`);
}
