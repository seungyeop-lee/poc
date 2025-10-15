import {
  ALL_FORMATS,
  BlobSource,
  BufferTarget,
  Conversion,
  getFirstEncodableVideoCodec,
  Input,
  Mp4OutputFormat,
  Output,
  WebMOutputFormat,
} from 'mediabunny';

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

interface VideoProcessingOptions {
  codec?: string;
  bitrate?: number;
  frameRate?: number;
  keyFrameInterval?: number;
  quality?: 'low' | 'medium' | 'high' | 'ultra';
}

export interface CropAndTrimVideoOptions {
  file: File;
  croppedAreaPixels: CroppedAreaPixels;
  trimRange: TrimRange;
  outputWidth?: number;
  outputHeight?: number;
  outputFormat?: string;
  onProgress?: (progress: number) => void;
  processingOptions?: VideoProcessingOptions;
}

export async function cropAndTrimVideo(options: CropAndTrimVideoOptions): Promise<Blob> {
  const {
    file,
    croppedAreaPixels,
    trimRange,
    outputWidth,
    outputHeight,
    outputFormat,
    onProgress,
    processingOptions,
  } = options;
  const finalWidth = outputWidth ?? Math.round(croppedAreaPixels.width);
  const finalHeight = outputHeight ?? Math.round(croppedAreaPixels.height);
  const finalFormat = outputFormat ?? 'video/webm';

  const input = new Input({
    formats: ALL_FORMATS,
    source: new BlobSource(file),
  });

  // 포맷에 따라 적절한 OutputFormat 선택
  const format = finalFormat === 'video/mp4' ? new Mp4OutputFormat() : new WebMOutputFormat();

  const output = new Output({
    format,
    target: new BufferTarget(),
  });

  // 브라우저가 지원하는 코덱 확인 및 선택
  const supportedCodecs = format.getSupportedVideoCodecs();
  let selectedCodec = processingOptions?.codec;

  if (selectedCodec) {
    // 사용자가 선택한 코덱이 해당 포맷에서 지원되는지 확인
    const encodableConfig = {
      width: finalWidth,
      height: finalHeight,
      bitrate: processingOptions?.bitrate ?? 1e6,
    };

    const isSupported = await getFirstEncodableVideoCodec(
      [selectedCodec as 'avc' | 'hevc' | 'vp9' | 'av1' | 'vp8'],
      encodableConfig,
    );

    if (!isSupported) {
      console.warn(`⚠️ 선택한 코덱 '${selectedCodec}'을(를) 인코딩할 수 없습니다. 대체 코덱을 찾는 중...`);
      selectedCodec = undefined;
    }
  }

  if (!selectedCodec) {
    // 브라우저가 지원하는 첫 번째 코덱 사용
    const encodableConfig = {
      width: finalWidth,
      height: finalHeight,
      bitrate: processingOptions?.bitrate ?? 1e6,
    };

    selectedCodec = (await getFirstEncodableVideoCodec(supportedCodecs, encodableConfig)) as string;

    if (!selectedCodec) {
      throw new Error(
        `브라우저가 ${finalFormat} 형식의 비디오 인코딩을 지원하지 않습니다. ` +
          `다른 브라우저(Chrome, Edge, Firefox 최신 버전)를 사용해 주세요.`,
      );
    }

    console.log(`✅ 자동 선택된 코덱: ${selectedCodec}`);
  }

  // 기본 비디오 설정
  const videoConfig: Record<string, unknown> = {
    crop: {
      left: Math.round(croppedAreaPixels.x),
      top: Math.round(croppedAreaPixels.y),
      width: Math.round(croppedAreaPixels.width),
      height: Math.round(croppedAreaPixels.height),
    },
    width: finalWidth,
    height: finalHeight,
    fit: 'fill', // width와 height를 정확히 맞춤
    codec: selectedCodec, // 확인된 코덱 사용
  };

  // 처리 옵션 적용 (디버깅을 위한 로그 포함)
  if (processingOptions) {
    console.log('🎥 적용되는 비디오 처리 옵션:', processingOptions);

    if (processingOptions.bitrate) {
      videoConfig.bitrate = processingOptions.bitrate;
      console.log(`✅ 비트레이트 설정: ${Math.round(processingOptions.bitrate / 1000)} kbps`);
    }

    if (processingOptions.frameRate) {
      videoConfig.frameRate = processingOptions.frameRate;
      console.log(`✅ 프레임률 설정: ${processingOptions.frameRate} fps`);
    }

    if (processingOptions.keyFrameInterval) {
      videoConfig.keyFrameInterval = processingOptions.keyFrameInterval;
      console.log(`✅ 키프레임 간격 설정: ${processingOptions.keyFrameInterval}초`);
    }
  }

  console.log(`🎬 최종 사용 코덱: ${selectedCodec}`);
  console.log(`📐 출력 해상도: ${finalWidth}x${finalHeight}`);
  console.log(`📦 출력 포맷: ${finalFormat}`);

  const conversion = await Conversion.init({
    input,
    output,
    video: videoConfig,
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
