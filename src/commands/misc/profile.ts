import Canvas from 'canvas';
import { Message } from 'discord.js';
import { getUser } from '../../utils/database.ts';
import {
  drawAvatar,
  drawBackground,
  drawText,
  drawWrappedText,
} from '../../utils/drawing.ts';

export const aliases: string[] = ['perfil'];

export async function profile(msg: Message) {
  const member = msg.mentions.users.first() || msg.author;
  const user = await getUser(member.id);

  const WIDTH = 600;
  const HEIGHT = 250;
  const canvas = Canvas.createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Fundo (imagem > cor)
  await drawBackground(
    ctx,
    WIDTH,
    HEIGHT,
    user.profile.bg_color,
    user.profile.bg_image
  );

  // Avatar circular
  await drawAvatar(
    ctx,
    member.displayAvatarURL({ extension: 'png', size: 256 }),
    HEIGHT
  );

  // Nome
  drawText(
    ctx,
    member.username,
    240,
    100,
    'bold 32px Sans',
    '#fff',
    '#000',
    3,
    'rgba(0,0,0,0.4)'
  );

  // Bio
  drawWrappedText(
    ctx,
    user.profile.bio || 'Sem biografia.',
    240,
    150,
    330,
    25,
    '20px Sans',
    '#ddd',
    '#000',
    2,
    'rgba(0,0,0,0.4)'
  );

  // Envia imagem
  await msg.reply({
    content: '🖼️ Aqui está seu perfil!',
    files: [canvas.toBuffer('image/png')],
  });
}
