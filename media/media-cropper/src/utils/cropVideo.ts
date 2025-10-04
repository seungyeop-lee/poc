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
  outputWidth?: number,
  outputHeight?: number,
  outputFormat?: string,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const {
    Input,
    Output,
    Conversion,
    ALL_FORMATS,
    BlobSource,
    WebMOutputFormat,
    Mp4OutputFormat,
    BufferTarget,
  } = await import('mediabunny');

  const finalWidth = outputWidth ?? Math.round(croppedAreaPixels.width);
  const finalHeight = outputHeight ?? Math.round(croppedAreaPixels.height);
  const finalFormat = outputFormat ?? 'video/webm';

  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  });

  // 포맷에 따라 적절한 OutputFormat 선택
  const format = finalFormat === 'video/mp4'
    ? new Mp4OutputFormat()
    : new WebMOutputFormat();

  const output = new Output({
    format,
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
      width: finalWidth,
      height: finalHeight,
      fit: 'fill', // width와 height를 정확히 맞춤
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

  return new Blob([buffer], { type: finalFormat });
}

export function checkWebCodecsSupport(): boolean {
  return 'VideoEncoder' in window && 'VideoDecoder' in window;
}
