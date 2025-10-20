import { Message } from 'discord.js';
import { getWarnings } from '../../repositories/warningsRepo.ts';

export const aliases: string[] = ['avisos'];
export const isAdminOnly = true;

export async function warns(msg: Message) {
  const target = msg.mentions.users.first();
  if (!target) return msg.reply('❌ | Use: `!warns @user`');

  const warns = await getWarnings(target.id);
  if (!warns || warns.length === 0)
    return msg.reply(`✅ | ${target} não possui advertências.`);

  const lines = warns.map((w, idx) => {
    const when = new Date(w.created_at).toLocaleString('pt-BR');
    return `**${idx + 1}.** ${when} — Por <@${w.moderator_id}> — ${w.reason}`;
  });

  const header = `⚠️ Advertências de ${target} — Total: ${warns.length}`;
  const content = [header, '', ...lines].join('\n');
  return msg.reply(content);
}
