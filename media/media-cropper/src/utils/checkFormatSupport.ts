export async function checkImageFormatSupport(format: string): Promise<boolean> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    canvas.toBlob(
      (blob) => {
        if (blob && blob.type === format) {
          resolve(true);
        } else {
          resolve(false);
        }
      },
      format,
      0.95
    );
  });
}

export function checkVideoFormatSupport(format: string): boolean {
  // WebCodecs API 지원 확인
  const webCodecsSupported = 'VideoEncoder' in window && 'VideoDecoder' in window;

  if (!webCodecsSupported) {
    return false;
  }

  // video/webm은 WebCodecs 지원 시 사용 가능
  if (format === 'video/webm') {
    return true;
  }

  // video/mp4는 mediabunny의 Mp4OutputFormat으로 지원
  if (format === 'video/mp4') {
    return true;
  }

  return false;
}
