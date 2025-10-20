import { Message } from 'discord.js';
import {
  getUser,
  addBalance,
  hasStartingClaimed,
  setStartingClaimed,
} from '../../utils/database.ts';

export const aliases: string[] = ['auxilio', 'bolsafamilia'];

export async function starting(msg: Message) {
  const userId = msg.author.id;

  await getUser(userId);

  const already = await hasStartingClaimed(userId);
  if (already) {
    return msg.reply(
      '❌ | Você já resgatou seu **bolsa família**. Este benefício só pode ser utilizado uma vez.'
    );
  }

  const amount = 150;
  await addBalance(userId, amount);
  await setStartingClaimed(userId);

  return msg.reply(
    `🎁 | Você recebeu seu **bolsa família** de **${amount} Guigacoins**! Boa sorte na jornada, nordestino!`
  );
}
