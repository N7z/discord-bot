import { Message } from 'discord.js';
import { addWarning } from '../../repositories/warningsRepo.ts';
import { getUser } from '../../utils/database.ts';

export const aliases: string[] = ['avisar'];
export const isAdminOnly = true;

export async function warn(msg: Message) {
  const target = msg.mentions.users.first();
  if (!target)
    return msg.reply(
      '❌ | Você precisa mencionar um usuário: `!warn @user motivo`.'
    );

  const parts = msg.content.trim().split(/\s+/);
  // parts[0] = !warn, parts[1] = @mention
  const reason = parts.slice(2).join(' ').trim();
  if (!reason)
    return msg.reply(
      '❌ | Você precisa informar o motivo: `!warn @user motivo`.'
    );

  // Ensure target user exists
  await getUser(target.id);

  await addWarning(target.id, msg.author.id, reason);

  return msg.reply(`⚠️ | ${target} foi advertido. Motivo: ${reason}`);
}
