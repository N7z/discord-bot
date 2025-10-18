import { Client, GatewayIntentBits, Message } from 'discord.js';
import dotenv from 'dotenv';
import { balance } from './commands/balance.ts';
import { daily } from './commands/daily.ts';
import './database.ts';

dotenv.config();
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

  const [cmd] = msg.content.slice(prefix.length).trim().split(' ');

  if (cmd === 'balance') await balance(msg);
  else if (cmd === 'daily') await daily(msg);
});

client.once('ready', () => console.log(`✅ Logado como ${client.user?.tag}`));
client.login(process.env.TOKEN);
