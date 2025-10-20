import { getUser, addBalance, removeBank } from '../../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['sacar', 'with', 'wd'];

export async function withdraw(msg: Message) {
  const userId = msg.author.id;
  const user = await getUser(userId);

  const args = msg.content.split(' ');
  const amountStr = args[1];
  if (!amountStr)
    return msg.reply(`❌ | Você precisa especificar um valor de Guigacoins.`);

  const amount = amountStr === 'all' ? user.bank : parseInt(amountStr);
  if (isNaN(amount) || amount <= 0)
    return msg.reply(`❌ | Você precisa especificar um número ou 'all'.`);

  if (user.bank < amount)
    return msg.reply(
      `❌ | Você não tem Guigacoins suficientes no banco para sacar.`
    );

  await removeBank(userId, amount);
  await addBalance(userId, amount);

  msg.reply(`🏧 | Você sacou **${amount} Guigacoins** do banco!`);
}
