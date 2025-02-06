import {Renderer} from '@/lib/webcodecsref/types';

export class Canvas2DRenderer implements Renderer {
  #canvas: OffscreenCanvas;
  #ctx: OffscreenCanvasRenderingContext2D;

  constructor(canvas: OffscreenCanvas) {
    this.#canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.#ctx = ctx;
  }

  draw(frame: VideoFrame) {
    this.#canvas.width = frame.displayWidth;
    this.#canvas.height = frame.displayHeight;
    this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
    frame.close();
  }
}
