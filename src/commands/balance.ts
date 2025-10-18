import { getUser } from '../utils/database.ts';
import { Message } from 'discord.js';

export async function balance(msg: Message) {
  const userId = msg.author.id;
  const user = await getUser(userId);
  msg.reply(`💰 Carteira: ${user.balance}\n🏦 Investido: ${user.invested}`);
}
