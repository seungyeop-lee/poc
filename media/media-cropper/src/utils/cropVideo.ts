interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TrimRange {
  start: number;
  end: number;
}

export async function cropAndTrimVideo(
  file: File,
  croppedAreaPixels: CroppedAreaPixels,
  trimRange: TrimRange,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const {
    Input,
    Output,
    Conversion,
    ALL_FORMATS,
    BlobSource,
    WebMOutputFormat,
    BufferTarget,
  } = await import('mediabunny');

  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  });

  const output = new Output({
    format: new WebMOutputFormat(),
    target: new BufferTarget(),
  });

  const conversion = await Conversion.init({
    input,
    output,
    video: {
      crop: {
        left: Math.round(croppedAreaPixels.x),
        top: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      },
    },
    trim: trimRange,
  });

  if (onProgress) {
    conversion.onProgress = onProgress;
  }

  await conversion.execute();

  const buffer = output.target.buffer;
  if (!buffer) {
    throw new Error('No buffer generated');
  }

  return new Blob([buffer], { type: 'video/webm' });
}

export function checkWebCodecsSupport(): boolean {
  return 'VideoEncoder' in window && 'VideoDecoder' in window;
}
