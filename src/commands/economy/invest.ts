import { getUser, removeBalance, addInvested } from '../../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['investir'];

export async function invest(msg: Message) {
  const userId = msg.author.id;
  const user = await getUser(userId);

  const args = msg.content.split(' ');
  const amountStr = args[1];
  if (!amountStr)
    return msg.reply(`❌ | Você precisa especificar um valor de Guigacoins.`);

  const amount = amountStr === 'all' ? user.balance : parseInt(amountStr);
  if (isNaN(amount) || amount <= 0)
    return msg.reply(`❌ | Você precisa especificar um número ou 'all'.`);

  if (user.balance < amount)
    return msg.reply(
      `❌ | Você não tem Guigacoins suficientes para esse investimento.`
    );

  await removeBalance(userId, amount);
  await addInvested(userId, amount);

  msg.reply(`💼 | Você investiu **${amount} Guigacoins**!`);
}
