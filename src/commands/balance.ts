import { getUser } from '../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['bal', 'saldo', 'carteira'];

export async function balance(msg: Message) {
  const userId = msg.mentions.users.first()?.id || msg.author.id;
  const user = await getUser(userId);
  msg.reply(`💰 | Carteira: ${user.balance}\n🏦 | Investido: ${user.invested}`);
}
