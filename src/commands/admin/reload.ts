import { Message } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import 'colors';

import {
  commands,
  commandFiles,
  type CommandMetaExtended,
} from '../../handlers/commandHandler.ts';

export const aliases: string[] = ['rl', 'refresh'];
export const isAdminOnly = true;

async function walkDir(dir: string): Promise<string[]> {
  const result: string[] = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      result.push(...(await walkDir(fullPath)));
    } else if (file.endsWith('.ts')) {
      result.push(fullPath);
    }
  }
  return result;
}

export async function reload(msg: Message) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const commandDir = path.join(__dirname, '..');

    for (const key of Object.keys(commands)) delete commands[key];
    commandFiles.length = 0;

    const files = await walkDir(commandDir);

    for (const file of files) {
      const modulePath = pathToFileURL(file).href + `?update=${Date.now()}`;
      const commandName = path.parse(file).name;
      const module = await import(modulePath);

      const fn = module[commandName] as
        | ((msg: Message) => Promise<void>)
        | undefined;
      const cmdIsAdmin = module.isAdminOnly ?? false;
      const aliases: string[] = module.aliases ?? [];

      if (fn) {
        const meta: CommandMetaExtended = {
          execute: fn,
          isAdminOnly: cmdIsAdmin,
          filePath: file,
        };
        commands[commandName] = meta;
        commandFiles.push(commandName);

        for (const alias of aliases) {
          commands[alias] = meta;
        }
      }
    }

    msg.reply(`♻️ | ${commandFiles.length} comandos recarregados com sucesso!`);
    console.log(' [♻]'.cyan, 'Comandos recarregados via reload.');
  } catch (err) {
    console.error('Erro ao recarregar comandos:', err);
    msg.reply('❌ | Ocorreu um erro ao tentar recarregar os comandos.');
  }
}
