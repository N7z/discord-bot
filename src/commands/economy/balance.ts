import { Message } from 'discord.js';
import { getUser } from '../../utils/database.ts';

export const aliases: string[] = ['bal', 'saldo', 'carteira'];

export async function balance(msg: Message) {
  const userId = msg.mentions.users.first()?.id || msg.author.id;
  const user = await getUser(userId);
  msg.reply(`💰 | Carteira: ${user.balance}\n🏦 | Banco: ${user.bank}`);
}
