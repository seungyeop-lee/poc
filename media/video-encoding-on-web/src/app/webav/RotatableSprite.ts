import {MP4Clip, OffscreenSprite} from "@webav/av-cliper";

export class RotatableSprite extends OffscreenSprite {
  #rotation: number;

  constructor(clip: MP4Clip, ops: { width?: number; height?: number; rotation?: number }) {
    super(clip);
    this.#rotation = ops.rotation || 0;
    this.rect.w = ops.width || this.rect.w;
    this.rect.h = ops.height || this.rect.h;

    if (this.#isVertical()) {
      this.rect.x = (this.rect.h - this.rect.w) / 2;
      this.rect.y = (this.rect.w - this.rect.h) / 2;
      this.rect.angle = (this.#rotation * Math.PI) / 180;
    }
  }

  getWidth() {
    return this.#isVertical() ? this.rect.h : this.rect.w;
  }

  getHeight() {
    return this.#isVertical() ? this.rect.w : this.rect.h;
  }

  #isVertical() {
    return this.#rotation === 90 || this.#rotation === 270;
  }
}
