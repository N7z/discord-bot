import { Client, GatewayIntentBits, Message } from 'discord.js';
import { fileURLToPath, pathToFileURL } from 'url';
import './utils/database.ts';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const commands: { [key: string]: (msg: Message) => Promise<void> } = {};

async function loadCommands() {
  const commandDir = path.join(__dirname, 'commands');
  const files = fs
    .readdirSync(commandDir)
    .filter((file) => file.endsWith('.ts'));

  for (const file of files) {
    const commandName = path.parse(file).name;
    const commandPath = pathToFileURL(path.join(commandDir, file)).href;
    const commandModule = await import(commandPath);
    const commandFn = commandModule[commandName] as
      | ((msg: Message) => Promise<void>)
      | undefined;

    if (commandFn) commands[commandName] = commandFn;
  }
}

async function main() {
  await loadCommands();

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const prefix = process.env.PREFIX || '!';

  client.on('messageCreate', async (msg: Message) => {
    if (msg.author.bot || !msg.content.startsWith(prefix)) return;

    const [cmdRaw] = msg.content.slice(prefix.length).trim().split(' ');
    const cmd = cmdRaw?.toLowerCase();

    if (!cmd || !(cmd in commands)) return;

    const command = commands[cmd];
    if (command) {
      await command(msg);
    }
  });

  client.once('clientReady', () =>
    console.log(`✅ Logado como ${client.user?.tag}`)
  );
  client.login(process.env.TOKEN);
}

main();
