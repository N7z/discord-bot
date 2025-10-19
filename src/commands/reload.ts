import { Message } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import fs from 'fs';
import 'colors';

import { commands } from '../handlers/commandHandler.ts';

export const aliases: string[] = ['rl', 'refresh'];
export const isAdminOnly = true;

export async function reload(msg: Message) {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // limpa comandos atuais
    for (const key of Object.keys(commands)) {
      delete commands[key];
    }

    const parentDir = path.resolve(__dirname, '..');
    const commandPath = path.join(parentDir, 'commands');
    const files = fs.readdirSync(commandPath).filter((f) => f.endsWith('.ts'));

    for (const file of files) {
      const modulePath = pathToFileURL(path.join(commandPath, file)).href;
      const commandName = path.parse(file).name;

      // importa com query param pra forçar reload
      const module = await import(`${modulePath}?update=${Date.now()}`);

      const fn = module[commandName] as
        | ((msg: Message) => Promise<void>)
        | undefined;
      const isAdminOnly = module.isAdminOnly ?? false;

      if (fn) {
        commands[commandName] = { execute: fn, isAdminOnly };
        const aliases: string[] = module.aliases ?? [];
        for (const alias of aliases) {
          commands[alias] = { execute: fn, isAdminOnly };
        }
      }
    }

    msg.reply(`♻️ | ${files.length} comandos foram recarregados com sucesso!`);
    console.log(' [♻]'.cyan, 'Comandos recarregados via reload.');
  } catch (err) {
    console.error('Erro ao recarregar comandos:', err);
    msg.reply('❌ | Ocorreu um erro ao tentar recarregar os comandos.');
  }
}
