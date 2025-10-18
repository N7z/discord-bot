import { Client, GatewayIntentBits, Message } from 'discord.js';
import { calculateInvestments } from './utils/investments.ts';
import { fileURLToPath, pathToFileURL } from 'url';
import './utils/database.ts';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import 'colors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../package.json'), 'utf-8')
);

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

  console.log(
    ' [✓]'.green,
    `${files.length} comandos foram carregados com sucesso.`
  );
}

async function main() {
  console.clear();
  console.log(
    `
   ___________         ___.           __   
  /   _____/  | __ ____\\_ |__   _____/  |_ ${pkg.version}
  \\_____  \\|  |/ // __ \\| __ \\ /  _ \\   __\\
  /        \\    <\\  ___/| \\_\\ (  <_> )  |  
 /_______  /__|_ \\\\___  >___  /\\____/|__|  
         \\/     \\/    \\/    \\/              
  `.magenta
  );

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

  client.once('clientReady', () => {
    console.log(' [✓]'.green, `Logado como ${client.user?.tag}`);

    setInterval(async () => calculateInvestments(), 60000);
  });

  client.login(process.env.TOKEN);
}

main();
