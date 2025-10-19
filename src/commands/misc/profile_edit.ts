import { Message } from 'discord.js';
import {
  getUser,
  updateBio,
  updateBgColor,
  updateBgImage,
} from '../../utils/database.ts';

export const aliases: string[] = ['edit', 'editar'];

export async function profile_edit(msg: Message) {
  const userId = msg.author.id;
  await getUser(userId); // garante que o perfil existe

  const args = msg.content.trim().split(/\s+/);
  const field = args[1];
  const value = args.slice(2).join(' ');
  const attachment = msg.attachments.first();

  if (!field && !attachment) {
    return msg.reply(
      `❌ | Uso correto:\n` +
        `\`!profile_edit bio <texto>\` — altera sua biografia\n` +
        `\`!profile_edit bg <cor>\` — altera a cor de fundo (ex: #1abc9c)\n` +
        `\`!profile_edit bg (com uma imagem anexada)\` — define uma imagem de fundo`
    );
  }

  switch (field?.toLowerCase()) {
    case 'bio':
      if (!value) return msg.reply('❌ | Forneça o novo texto da bio.');
      if (value.length > 120)
        return msg.reply('⚠️ | Sua bio deve ter no máximo 120 caracteres.');
      await updateBio(userId, value);
      await msg.reply(`✅ | Sua nova bio foi atualizada: "${value}"`);
      break;

    case 'bg':
    case 'bg_color':
    case 'background':
      // IMAGEM
      if (attachment) {
        const imageUrl = attachment.url;
        await updateBgImage(userId, imageUrl);
        return msg.reply(`🖼️ | Imagem de fundo atualizada com sucesso!`);
      }

      // COR
      if (!value)
        return msg.reply(
          '❌ | Envie uma cor (#hex ou nome CSS) ou uma imagem.'
        );
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(value) && !/^[a-zA-Z]+$/.test(value))
        return msg.reply(
          '❌ | Cor inválida. Use HEX (ex: #ff0000) ou nome (ex: blue).'
        );
      await updateBgColor(userId, value);
      await msg.reply(`✅ | Cor de fundo atualizada para **${value}**`);
      break;

    default:
      msg.reply(`❌ | Campo desconhecido. Use \`bio\` ou \`bg\`.`);
  }
}
