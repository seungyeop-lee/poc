export async function checkImageFormatSupport(format: string): Promise<boolean> {
  // OffscreenCanvas API 지원 여부 확인
  // 미지원 브라우저(Safari 16.4 미만, Firefox 105 미만 등)에서는 false 반환
  if (OffscreenCanvas === undefined) {
    return false;
  }

  try {
    // 1x1 픽셀 크기의 OffscreenCanvas 생성 (최소 크기로 테스트)
    const canvas = new OffscreenCanvas(1, 1);
    console.log('🎨 OffscreenCanvas 생성 성공');

    // 2D 렌더링 컨텍스트 생성 (convertToBlob() 호출에 필수)
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('⚠️ 2D 렌더링 컨텍스트 생성 실패');
      return false;
    }

    // 최소한의 그리기 작업 수행 (컨텍스트 활성화용)
    // 투명 픽셀 하나를 그려 렌더링 컨텍스트를 활성화
    ctx.clearRect(0, 0, 1, 1);

    // 지정된 포맷으로 blob 변환 시도 (품질 0.95)
    // convertToBlob()은 Promise를 반환하므로 await 사용
    const blob = await canvas.convertToBlob({
      type: format,
      quality: 0.95,
    });
    console.log(`🎨 convertToBlob() 호출 성공, 요청한 포맷: ${format}, 생성된 blob의 MIME 타입: ${blob.type}`);

    // 생성된 blob의 MIME 타입이 요청한 포맷과 일치하는지 확인
    // 일치하면 해당 포맷을 브라우저가 지원하는 것으로 판단
    return blob.type === format;
  } catch (error) {
    console.warn(`⚠️ convertToBlob() 호출 실패: ${error}`);
    // 변환 실패 시 (지원하지 않는 포맷 등) false 반환
    return false;
  }
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
