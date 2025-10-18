import { getUser, addBalance, updateLastWork } from '../utils/database.ts';
import { Message } from 'discord.js';

export async function work(msg: Message) {
  const userId = msg.author.id;
  const now = Date.now();
  const cooldown = 5 * 60 * 1000; // 5 minutos

  const user = await getUser(userId);

  if (user.last_work && now - user.last_work < cooldown) {
    const remainingMs = cooldown - (now - user.last_work);
    const minutes = Math.floor(remainingMs / 60000);
    const seconds = Math.floor((remainingMs % 60000) / 1000);

    const timeString =
      minutes > 0
        ? `${minutes} minuto${minutes > 1 ? 's' : ''} e ${seconds} segundo${
            seconds !== 1 ? 's' : ''
          }`
        : `${seconds} segundo${seconds !== 1 ? 's' : ''}`;

    return msg.reply(
      `⏳ | Espere mais ${timeString} para trabalhar novamente!`
    );
  }

  const reward = Math.floor(Math.random() * 76) + 50; // Recompensa entre 50 e 125
  await addBalance(userId, reward);
  await updateLastWork(userId, now);

  msg.reply(`🎁 | Você trabalhou e recebeu **${reward} Guigacoins**!`);
}
