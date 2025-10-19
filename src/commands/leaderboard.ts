import { Message } from 'discord.js';
import { getAllUsers } from '../utils/database.ts';

export const aliases: string[] = ['top', 'leaderstats', 'lb'];

export async function leaderboard(msg: Message) {
  const message = await msg.reply('🔃 | Buscando informações...');

  const users = await getAllUsers();
  if (!users || users.length === 0)
    return msg.reply('❌ | Nenhum usuário encontrado no ranking.');

  const sorted = users
    .sort((a, b) => b.balance + b.invested - (a.balance + a.invested))
    .slice(0, 10);

  let leaderboard = '🏆 **Top 10 Mais Ricos** 🏆\n\n';
  for (let i = 0; i < sorted.length; i++) {
    const u = sorted[i];
    if (!u) continue;

    const member = await msg.guild?.members.fetch(u.id).catch(() => null);
    const name = member?.user.username || `Usuário ${u.id}`;
    leaderboard += `**${i + 1}.** ${name} — 💰 ${u.balance} | 🏦 ${
      u.invested
    }\n`;
  }

  await message.edit(leaderboard);
}
