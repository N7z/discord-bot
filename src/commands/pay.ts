import { getUser, addBalance, removeBalance } from '../utils/database.ts';
import { Message } from 'discord.js';

export const aliases: string[] = ['pagar', 'enviar', 'pix', 'transferir'];

export async function pay(msg: Message) {
  const userId = msg.author.id;
  const user = await getUser(userId);

  const target = msg.mentions.members?.first();
  if (!target)
    return msg.reply(
      `❌ | Você precisa mencionar um usuário para enviar Guigacoins.`
    );

  const args = msg.content.split(' ');
  const amountStr = args[2];
  if (!amountStr)
    return msg.reply(`❌ | Você precisa especificar um valor de Guigacoins.`);

  const amount = amountStr === 'all' ? user.balance : parseInt(amountStr);
  if (isNaN(amount) || amount <= 0)
    return msg.reply(`❌ | Você precisa especificar um número ou 'all'.`);

  if (target.id === userId)
    return msg.reply(`❌ | Você não pode enviar Guigacoins para si mesmo.`);

  if (target.user.bot)
    return msg.reply(`❌ | Você não pode enviar Guigacoins para bots.`);

  // Caso usuário ainda não seja cadastrado, isso vai cadastrar ele no db
  await getUser(target.id);

  if (user.balance < amount)
    return msg.reply(
      `❌ | Você não tem Guigacoins suficientes para essa transação.`
    );

  await removeBalance(userId, amount);
  await addBalance(target.id, amount);

  msg.reply(
    `💸 | Você enviou **${amount} Guigacoins** para **${target.user.username}**!`
  );

  target.send(
    `💸 | Você recebeu **${amount} Guigacoins** de **${msg.author.username}**!`
  );
}
