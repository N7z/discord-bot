import { getUser } from '../utils/database.ts';
import { Message } from 'discord.js';

export async function balance(msg: Message) {
  const userId = msg.author.id;
  const user = await getUser(userId);
  msg.reply(`💰 Você tem ${user.balance} Guigacoins.`);
}
