import { Message } from 'discord.js';
import { commands, commandFiles } from '../../handlers/commandHandler.ts';
import path from 'path';

export const aliases: string[] = ['ajuda', 'comandos'];

export async function help(msg: Message) {
  const grouped: Record<string, string[]> = {};

  for (const cmdName of commandFiles) {
    const cmd = commands[cmdName];
    if (!cmd) continue;

    const parts = path
      .relative(path.join(process.cwd(), 'src/commands'), cmd.filePath)
      .split(path.sep);
    const type = (parts.length > 1 ? parts[0] : 'Geral') || '';

    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(cmdName);
  }

  let replyMsg = '📜 | Lista de comandos disponíveis:\n';
  for (const type in grouped) {
    if (type === 'admin') continue;

    replyMsg += `\n**${type}**\n`;
    for (const cmdName of grouped[type] || []) {
      replyMsg += `- !${cmdName}\n`;
    }
  }

  msg.reply(replyMsg);
}
