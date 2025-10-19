import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import 'colors';
import type { CommandMeta } from '../types/index.ts';

export const commands: Record<string, CommandMeta> = {};
export const commandFiles: string[] = [];

async function loadCommandFile(filePath: string) {
  const commandModule = await import(pathToFileURL(filePath).href);
  const commandName = path.parse(filePath).name;

  const execute = commandModule[commandName] as (msg: Message) => Promise<void>;
  const isAdminOnly = commandModule.isAdminOnly ?? false;
  const aliases: string[] = commandModule.aliases ?? [];

  if (!execute) return;

  commands[commandName] = { execute, isAdminOnly };
  commandFiles.push(commandName);

  for (const alias of aliases) {
    commands[alias] = { execute, isAdminOnly };
  }
}

async function walkDir(dir: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      await walkDir(fullPath); // recursivo
    } else if (file.endsWith('.ts')) {
      await loadCommandFile(fullPath);
    }
  }
}

export async function loadCommands() {
  const commandDir = path.join(process.cwd(), 'src/commands');
  await walkDir(commandDir);

  console.log(
    ' [✓]'.green,
    `${commandFiles.length} comandos carregados com sucesso (excluindo aliases)`
  );
}
