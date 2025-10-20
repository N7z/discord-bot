import { Client } from 'discord.js';
import { calculateInvestments } from '../utils/investments.ts';
import { initDatabase } from '../database/connection.ts';
import { runMigrations } from '../database/migrations.ts';

export default async function clientReady(client: Client) {
  console.log(' [✓]'.green, `Logado como ${client.user?.tag}`);

  // Initialize database and run migrations at startup
  const db = await initDatabase();
  await runMigrations(db);

  setInterval(() => calculateInvestments(), 60000);
}
