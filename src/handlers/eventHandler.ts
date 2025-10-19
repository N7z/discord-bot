import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { Client } from 'discord.js';

export async function loadEvents(client: Client) {
  const eventDir = path.join(process.cwd(), 'src/events');
  const files = fs.readdirSync(eventDir).filter((f) => f.endsWith('.ts'));

  for (const file of files) {
    const filePath = pathToFileURL(path.join(eventDir, file)).href;
    const eventName = path.parse(file).name;
    const eventModule = await import(filePath);

    if (eventModule.default) {
      client.on(eventName, (...args) => eventModule.default(...args, client));
    }
  }

  console.log(' [✓]'.green, `${files.length} eventos carregados.`);
}
