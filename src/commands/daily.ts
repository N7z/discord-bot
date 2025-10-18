import { db } from '../database.ts';
import { Message } from 'discord.js';

export async function daily(msg: Message) {
  const userId = msg.author.id;
  const now = Date.now();

  let user = await db.get('SELECT * FROM users WHERE id = ?', userId);
  if (!user) {
    await db.run(
      'INSERT INTO users (id, balance, last_daily) VALUES (?, 0, 0)',
      userId
    );
    user = { balance: 0, last_daily: 0 };
  }

  const diff = now - user.last_daily;
  if (diff < 24 * 60 * 60 * 1000)
    return msg.reply('⏳ Você já pegou o daily hoje!');

  const reward = 100;
  await db.run(
    'UPDATE users SET balance = balance + ?, last_daily = ? WHERE id = ?',
    reward,
    now,
    userId
  );

  msg.reply(`🎁 Você recebeu ${reward} Guigacoins!`);
}
