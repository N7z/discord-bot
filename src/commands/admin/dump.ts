import { Message } from 'discord.js';
import { getUser } from '../../utils/database.ts';

export const aliases: string[] = [];
export const isAdminOnly: boolean = true;

export async function dump(msg: Message) {
  const userId = msg.mentions.users.first()?.id || msg.author.id;
  const user = await getUser(userId);
  msg.reply(
    `🗃️ | Dados do usuário:\n\`\`\`json\n${JSON.stringify(
      user,
      null,
      2
    )}\n\`\`\``
  );
}
