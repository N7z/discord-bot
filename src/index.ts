import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import 'colors';
import { loadCommands } from './handlers/commandHandler.ts';
import { loadEvents } from './handlers/eventHandler.ts';

dotenv.config();

console.clear();
console.log(
  `
  /$$$$$$  /$$                 /$$                   /$$    
 /$$__  $$| $$                | $$                  | $$    
| $$  \\__/| $$   /$$  /$$$$$$ | $$$$$$$   /$$$$$$  /$$$$$$  
|  $$$$$$ | $$  /$$/ /$$__  $$| $$__  $$ /$$__  $$|_  $$_/  
 \\____  $$| $$$$$$/ | $$$$$$$$| $$  \\ $$| $$  \\ $$  | $$    
 /$$  \\ $$| $$_  $$ | $$_____/| $$  | $$| $$  | $$  | $$ /$$
|  $$$$$$/| $$ \\  $$|  $$$$$$$| $$$$$$$/|  $$$$$$/  |  $$$$/
 \\______/ |__/  \\__/ \\_______/|_______/  \\______/    \\___/  
`.green
);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

await loadCommands();
await loadEvents(client);
client.login(process.env.TOKEN);
