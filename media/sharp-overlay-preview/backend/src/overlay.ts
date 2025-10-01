import sharp from "sharp";
import type { CouponEmbeddingSettings } from "./types.js";

export async function overlayText(
	imageBuffer: Buffer,
	text: string,
	settings: CouponEmbeddingSettings,
): Promise<Buffer> {
	const metadata = await sharp(imageBuffer).metadata();

	// Fallback font chain for consistent rendering across environments
	const fontFamily = settings.fontFamily === "Arial"
		? "Arial, Liberation Sans, DejaVu Sans, sans-serif"
		: settings.fontFamily;

	const svg = `
    <svg width="${metadata.width}" height="${metadata.height}">
      <text
        x="${settings.left}"
        y="${settings.top}"
        font-family="${fontFamily}"
        font-size="${settings.fontSize}"
        font-weight="${settings.fontWeight}"
        fill="${settings.fontColor}"
      >${text}</text>
    </svg>
  `;

	return await sharp(imageBuffer)
		.composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
		.png()
		.toBuffer();
}
