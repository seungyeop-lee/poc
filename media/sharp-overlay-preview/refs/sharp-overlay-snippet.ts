import sharp from 'sharp';
import { CouponEmbeddingSettings } from './src/types/CouponEmbeddingSettings';

async function overlayText(
  imageBuffer: Buffer,
  text: string,
  settings: CouponEmbeddingSettings
): Promise<Buffer> {
  const svg = `
    <svg>
      <text
        x="${settings.left}"
        y="${settings.top}"
        font-size="${settings.fontSize}"
        fill="${settings.fontColor}"
        font-family="${settings.fontFamily}"
        font-weight="${settings.fontWeight}"
      >${text}</text>
    </svg>
  `;

  const svgBuffer = Buffer.from(svg);

  return await sharp(imageBuffer)
    .composite([{ input: svgBuffer, top: 0, left: 0 }])
    .toBuffer();
}