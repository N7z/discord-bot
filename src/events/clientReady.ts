import { Client } from 'discord.js';
import { calculateInvestments } from '../utils/investments.ts';

export default async function clientReady(client: Client) {
  console.log(' [✓]'.green, `Logado como ${client.user?.tag}`);
  setInterval(() => calculateInvestments(), 60000);
}
