import Canvas from 'canvas';
import { Message, AttachmentBuilder } from 'discord.js';
import { getUser } from '../../utils/database.ts';
import {
  drawAvatar,
  drawBackground,
  drawText,
  drawWrappedText,
} from '../../utils/drawing.ts';

export const aliases: string[] = ['perfil'];

const CANVAS_CONFIG = {
  WIDTH: 600,
  HEIGHT: 250,
  AVATAR_SIZE: 256,
} as const;

const STYLES = {
  username: {
    x: 240,
    y: 60,
    font: 'bold 32px Sans',
    color: '#fff',
    stroke: '#000',
    strokeWidth: 3,
    shadow: 'rgba(0,0,0,0.4)',
  },
  balance: {
    x: 240,
    y: 100,
    font: '20px Sans',
    color: '#00ff00',
    stroke: '#000',
    strokeWidth: 2,
    shadow: 'rgba(0,0,0,0.4)',
  },
  invested: {
    x: 350,
    y: 100,
    font: '20px Sans',
    color: '#3c00ff82',
    stroke: '#000',
    strokeWidth: 2,
    shadow: 'rgba(0,0,0,0.4)',
  },
  bio: {
    x: 240,
    y: 135,
    maxWidth: 330,
    lineHeight: 25,
    font: '20px Sans',
    color: '#ecececff',
    stroke: '#000',
    strokeWidth: 2,
    shadow: 'rgba(0,0,0,0.4)',
  },
} as const;

export async function profile(msg: Message) {
  const statusMessage = await msg.reply('🔃 | Buscando informações...');

  try {
    const targetUser = msg.mentions.users.first() || msg.author;
    const userData = await getUser(targetUser.id);

    const canvas = Canvas.createCanvas(
      CANVAS_CONFIG.WIDTH,
      CANVAS_CONFIG.HEIGHT
    );
    const ctx = canvas.getContext('2d');

    await drawBackground(
      ctx,
      CANVAS_CONFIG.WIDTH,
      CANVAS_CONFIG.HEIGHT,
      userData.profile.bg_color,
      userData.profile.bg_image
    );

    await drawAvatar(
      ctx,
      targetUser.displayAvatarURL({
        extension: 'png',
        size: CANVAS_CONFIG.AVATAR_SIZE,
      }),
      CANVAS_CONFIG.HEIGHT
    );

    // Desenha textos
    const { username, balance, invested, bio } = STYLES;

    drawText(
      ctx,
      targetUser.displayName,
      username.x,
      username.y,
      username.font,
      username.color,
      username.stroke,
      username.strokeWidth,
      username.shadow
    );

    drawText(
      ctx,
      `🪙 ${userData.balance.toLocaleString('pt-BR')}`,
      balance.x,
      balance.y,
      balance.font,
      balance.color,
      balance.stroke,
      balance.strokeWidth,
      balance.shadow
    );

    drawText(
      ctx,
      `🏦 ${userData.invested.toLocaleString('pt-BR')}`,
      invested.x,
      invested.y,
      invested.font,
      invested.color,
      invested.stroke,
      invested.strokeWidth,
      invested.shadow
    );

    drawWrappedText(
      ctx,
      userData.profile.bio || 'Sem biografia.',
      bio.x,
      bio.y,
      bio.maxWidth,
      bio.lineHeight,
      bio.font,
      bio.color,
      bio.stroke,
      bio.strokeWidth,
      bio.shadow
    );

    const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
      name: `perfil-${targetUser.id}.png`,
    });

    await statusMessage.edit({
      content: `🖼️ **Perfil de ${targetUser.displayName}**`,
      files: [attachment],
    });
  } catch (error) {
    console.error('Erro ao gerar perfil:', error);
    await statusMessage.edit({
      content:
        '❌ | Ocorreu um erro ao gerar o perfil. Tente novamente mais tarde.',
    });
  }
}
