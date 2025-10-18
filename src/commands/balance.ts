import { db } from '../database.ts';
import { Message } from 'discord.js';

export async function balance(msg: Message) {
  const userId = msg.author.id;
  let user = await db.get('SELECT * FROM users WHERE id = ?', userId);
  if (!user) {
    await db.run('INSERT INTO users (id, balance) VALUES (?, 0)', userId);
    user = { balance: 0 };
  }
  msg.reply(`💰 Você tem ${user.balance} Guigacoins.`);
}
