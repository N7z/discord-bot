import { Message } from 'discord.js';
import { commands } from '../handlers/commandHandler.ts';

export default async function messageCreate(msg: Message) {
  const prefix = process.env.PREFIX || '!';
  if (msg.author.bot || !msg.content.startsWith(prefix)) return;

  const [cmdRaw] = msg.content.slice(prefix.length).trim().split(/\s+/);
  const cmd = cmdRaw?.toLowerCase();
  if (!cmd || !(cmd in commands)) return;

  const commandMeta = commands[cmd];
  if (commandMeta?.isAdminOnly && !msg.member?.permissions.has('Administrator'))
    return msg.reply(
      '❌ | Você precisa ser administrador para usar este comando.'
    );

  await commandMeta?.execute(msg);
}
