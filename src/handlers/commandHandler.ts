import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import 'colors';
import type { CommandMeta } from '../types/index.ts';

export const commands: Record<string, CommandMeta> = {};

export async function loadCommands() {
  const commandDir = path.join(process.cwd(), 'src/commands');
  const files = fs.readdirSync(commandDir).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const filePath = pathToFileURL(path.join(commandDir, file)).href;
    const commandName = path.parse(file).name;
    const commandModule = await import(filePath);

    const execute = commandModule[commandName] as (
      msg: Message
    ) => Promise<void>;
    const isAdminOnly = commandModule.isAdminOnly ?? false;
    const aliases: string[] = commandModule.aliases ?? [];

    commands[commandName] = { execute, isAdminOnly };
    for (const alias of aliases) {
      commands[alias] = { execute, isAdminOnly };
    }
  }

  console.log(' [✓]'.green, `${files.length} comandos carregados com sucesso.`);
}
