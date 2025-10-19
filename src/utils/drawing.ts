import Canvas, { CanvasRenderingContext2D } from 'canvas';

export async function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  color?: string,
  imageUrl?: string
) {
  if (imageUrl) {
    try {
      ctx.drawImage(await Canvas.loadImage(imageUrl), 0, 0, w, h);
      return;
    } catch {
      console.warn('Erro ao carregar bg:', imageUrl);
    }
  }
  ctx.fillStyle = color || '#2c2f33';
  ctx.fillRect(0, 0, w, h);
}

export async function drawAvatar(
  ctx: CanvasRenderingContext2D,
  url: string,
  canvasHeight: number
) {
  const avatar = await Canvas.loadImage(url);
  const size = 180;
  const x = 30;
  const y = (canvasHeight - size) / 2;

  ctx.drawImage(avatar, x, y, size, size);
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  fill: string,
  stroke?: string,
  lineWidth = 2,
  shadow?: string
) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.lineWidth = lineWidth;
  if (shadow) {
    ctx.shadowColor = shadow;
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }
  if (stroke) ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.shadowColor = 'transparent';
}

export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  fill: string,
  stroke?: string,
  lineWidth = 2,
  shadow?: string
) {
  ctx.font = font;
  ctx.fillStyle = fill;
  ctx.lineWidth = lineWidth;
  if (shadow) {
    ctx.shadowColor = shadow;
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
  }

  let line = '';
  for (const word of text.split(' ')) {
    const testLine = line + word + ' ';
    if (ctx.measureText(testLine).width > maxWidth && line !== '') {
      if (stroke) ctx.strokeText(line, x, y);
      ctx.fillText(line, x, y);
      line = word + ' ';
      y += lineHeight;
    } else line = testLine;
  }
  if (stroke) ctx.strokeText(line, x, y);
  ctx.fillText(line, x, y);
  ctx.shadowColor = 'transparent';
}
