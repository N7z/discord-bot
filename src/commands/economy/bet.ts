import { getUser, addBalance, removeBalance } from '../../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['apostar', 'roll'];

export async function bet(msg: Message) {
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
      `❌ | Você não tem Guigacoins suficientes para essa transação.`
    );

  await removeBalance(userId, amount);

  const reply = await msg.reply(`🎲 | A moeda está girando...`);

  setTimeout(async () => {
    const win = Math.random() > 0.5;
    if (win) {
      await reply.edit(`🎉 | Você ganhou **${amount * 2} Guigacoins**!`);
      await addBalance(userId, amount * 2);
    } else {
      await reply.edit(`😭 | Você perdeu **${amount} Guigacoins**!`);
    }
  }, 1000);
}
