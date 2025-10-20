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
  bank: {
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

    // Draw daily streak (top-left) if active (claimed today or yesterday)
    {
      const now = new Date();
      const today = now.toISOString().split('T')[0] ?? '';
      const [lastDateRaw, lastStreakRaw] = (userData.last_daily || '').split(
        '|'
      ); // YYYY-MM-DD|streak
      const lastDate = lastDateRaw || '';
      const baseStreak =
        Number.isFinite(Number(lastStreakRaw)) && Number(lastStreakRaw) > 0
          ? Number(lastStreakRaw)
          : lastDate
          ? 1
          : 0;

      const yesterdayDate = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
      );
      const yesterday = yesterdayDate.toISOString().split('T')[0];

      const displayStreak =
        lastDate === today || lastDate === yesterday ? baseStreak : 0;

      if (displayStreak > 0) {
        const label = `🔥 ${displayStreak}`;
        ctx.save();
        ctx.font = 'bold 18px Sans';
        ctx.textBaseline = 'top';
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#000000';
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 2;
        ctx.strokeText(label, 25, 10);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffa500';
        ctx.fillText(label, 25, 10);
        ctx.restore();
      }
    }

    if (userData.starting_claimed) {
      ctx.save();
      const bx = 435;
      const by = 20;
      const bw = 150;
      const bh = 22;
      const r = 8;
      ctx.beginPath();
      ctx.moveTo(bx + r, by);
      ctx.lineTo(bx + bw - r, by);
      ctx.quadraticCurveTo(bx + bw, by, bx + bw, by + r);
      ctx.lineTo(bx + bw, by + bh - r);
      ctx.quadraticCurveTo(bx + bw, by + bh, bx + bw - r, by + bh);
      ctx.lineTo(bx + r, by + bh);
      ctx.quadraticCurveTo(bx, by + bh, bx, by + bh - r);
      ctx.lineTo(bx, by + r);
      ctx.quadraticCurveTo(bx, by, bx + r, by);
      ctx.closePath();
      ctx.fillStyle = '#1aa34a';
      ctx.globalAlpha = 0.9;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#0e572b';
      ctx.stroke();

      ctx.font = 'bold 14px Sans';
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.textBaseline = 'middle';
      const text = '✅ Bolsa Família';
      const tx = bx + 14;
      const ty = by + bh / 2;
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 2;
      ctx.strokeText(text, tx, ty);
      ctx.shadowBlur = 0;
      ctx.fillText(text, tx, ty);
      ctx.restore();
    }

    // Desenha textos
    const { username, balance, bank, bio } = STYLES;

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
      `🏦 ${userData.bank.toLocaleString('pt-BR')}`,
      bank.x,
      bank.y,
      bank.font,
      bank.color,
      bank.stroke,
      bank.strokeWidth,
      bank.shadow
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
      content: `🖼️ **Perfil de ${targetUser.displayName}** *(use !edit para editar)*`,
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
