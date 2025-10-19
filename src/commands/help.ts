import { Message } from 'discord.js';
import { commands } from '../handlers/commandHandler.ts';
import type { CommandMeta } from '../types/index.ts';

export const aliases: string[] = ['ajuda', 'comandos'];

export async function help(msg: Message) {
  const seen = new Set<CommandMeta>();
  const commandList: string[] = [];

  for (const cmdName in commands) {
    const cmdFn = commands[cmdName];
    if (!cmdFn) continue;

    if (!seen.has(cmdFn)) {
      seen.add(cmdFn);
      commandList.push(`- ${cmdName}`);
    }
  }

  msg.reply(`📜 | Lista de comandos disponíveis:\n${commandList.join('\n')}`);
}
