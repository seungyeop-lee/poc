import { Input, VideoSampleSink, BlobSource, MP4, WEBM } from 'mediabunny';

export interface VideoMetadata {
  width: number;
  height: number;
  frameRate: number;
  bitrate: number;
  duration: number;
  codec: string;
  fileSize: number;
  format: string;
  timeResolution?: number; // 키프레임 간격 계산용
}

export interface CodecSpecificOptions {
  codec: string;
  quality: 'low' | 'medium' | 'high' | 'ultra';
  bitrate?: number;
  frameRate?: number;
  keyFrameInterval?: number;
  hardwareAcceleration?: 'no-preference' | 'prefer-hardware' | 'prefer-software';
}

/**
 * 비디오 파일의 메타데이터를 추출합니다
 */
export async function extractVideoMetadata(file: File): Promise<VideoMetadata | null> {
  try {
    const input = new Input({
      formats: [MP4, WEBM],
      source: new BlobSource(file)
    });

    const videoTrack = await input.getPrimaryVideoTrack();
    if (!videoTrack) {
      throw new Error('비디오 트랙을 찾을 수 없습니다');
    }

    const decoderConfig = await videoTrack.getDecoderConfig();
    const duration = await videoTrack.computeDuration();

    // timeResolution 값 추출 (키프레임 간격 계산용)
    const timeResolution = (videoTrack as { timeResolution?: number }).timeResolution;

    // 비디오 샘플을 통해 메타데이터 수집
    const sink = new VideoSampleSink(videoTrack);
    const sample = await sink.getSample(0);

    if (!sample) {
      throw new Error('비디오 샘플을 가져올 수 없습니다');
    }

    // 파일 크기 (bytes)
    const fileSize = file.size;

    // 대략적인 비트레이트 계산 (bps)
    const bitrate = Math.round((fileSize * 8) / duration);

    // 프레임레이트 추출: mediabunny의 computePacketStats API 사용
    let frameRate = 30; // 기본값
    try {
      const packetStats = await videoTrack.computePacketStats(100);
      frameRate = packetStats.averagePacketRate;

      // NaN이나 유효하지 않은 값 처리
      if (!frameRate || frameRate <= 0 || !isFinite(frameRate)) {
        console.warn('computePacketStats 결과가 유효하지 않음, 샘플 기반 계산 시도');
        // fallback: 샘플 타임스탬프 기반 계산
        const sample1 = await sink.getSample(0);
        const sample2 = await sink.getSample(1);

        if (sample1 && sample2) {
          const timeDiff = (sample2.timestamp - sample1.timestamp) / 1_000_000;
          if (timeDiff > 0) {
            frameRate = Math.round(1 / timeDiff);
          }
          sample1.close();
          sample2.close();
        }
      }
    } catch (err) {
      console.warn('프레임률 추출 실패, 기본값 사용:', err);
      frameRate = 30;
    }

    const metadata: VideoMetadata = {
      width: sample.displayWidth || 1920,
      height: sample.displayHeight || 1080,
      frameRate,
      bitrate,
      duration,
      codec: decoderConfig?.codec || 'unknown',
      fileSize,
      format: file.type || 'unknown',
      timeResolution
    };

    sample.close();
    return metadata;

  } catch (error) {
    console.error('비디오 메타데이터 추출 실패:', error);
    return null;
  }
}

/**
 * 코덱별 최적 옵션을 추천합니다
 */
export function getOptimalCodecOptions(
  metadata: VideoMetadata,
  targetCodec: string,
  qualityLevel: 'low' | 'medium' | 'high' | 'ultra' = 'medium'
): CodecSpecificOptions {
  const options: CodecSpecificOptions = {
    codec: targetCodec,
    quality: qualityLevel
  };

  // 비트레이트 설정 (해상도와 품질 레벨에 따라)
  const pixelCount = metadata.width * metadata.height;
  let baseBitrate = 0;

  // 기본 비트레이트 계算 (해상도 기반)
  if (pixelCount <= 640 * 480) { // SD
    baseBitrate = 1000000; // 1 Mbps
  } else if (pixelCount <= 1280 * 720) { // HD
    baseBitrate = 2500000; // 2.5 Mbps
  } else if (pixelCount <= 1920 * 1080) { // Full HD
    baseBitrate = 5000000; // 5 Mbps
  } else { // 4K 이상
    baseBitrate = 15000000; // 15 Mbps
  }

  // 품질 레벨에 따른 비트레이트 조정
  const qualityMultipliers = {
    low: 0.5,
    medium: 1.0,
    high: 1.5,
    ultra: 2.0
  };

  options.bitrate = Math.round(baseBitrate * qualityMultipliers[qualityLevel]);

  // 프레임레이트 설정 (원본 유지 또는 표준 값)
  options.frameRate = metadata.frameRate >= 60 ? 60 :
                      metadata.frameRate >= 30 ? 30 :
                      metadata.frameRate;

  // 키프레임 간격 설정 (timeResolution 기반)
  if (metadata.timeResolution && metadata.timeResolution > 0) {
    // timeResolution을 기반으로 적절한 키프레임 간격 계산 (1-30프레임 범위)
    const calculatedInterval = Math.min(30, Math.max(1, Math.round(metadata.timeResolution * metadata.frameRate)));
    options.keyFrameInterval = calculatedInterval;
  } else {
    // fallback: 기본값
    options.keyFrameInterval = 2;
  }

  // 하드웨어 가속 설정
  options.hardwareAcceleration = 'no-preference';

  // 코덱별 최적화
  if (targetCodec.includes('avc') || targetCodec.includes('h264')) {
    // H.264 최적화
    options.keyFrameInterval = 2;
  } else if (targetCodec.includes('vp9')) {
    // VP9 최적화
    options.keyFrameInterval = 3;
  } else if (targetCodec.includes('av1')) {
    // AV1 최적화
    options.keyFrameInterval = 4;
  }

  return options;
}

/**
 * 포맷된 시간 문자열을 생성합니다
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const centisecs = Math.floor((seconds % 1) * 100);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  }
}

/**
 * 파일 크기를 사람이 읽기 쉬운 형태로 포맷합니다
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * 해상도 이름을 반환합니다
 */
export function getResolutionName(width: number, height: number): string {
  const pixelCount = width * height;

  if (pixelCount <= 640 * 480) return 'SD';
  if (pixelCount <= 1280 * 720) return 'HD';
  if (pixelCount <= 1920 * 1080) return 'Full HD';
  if (pixelCount <= 3840 * 2160) return '4K';
  return '8K+';
}

/**
 * 비트레이트를 사람이 읽기 쉬운 형태로 포맷합니다
 */
export function formatBitrate(bps: number): string {
  const mbps = bps / 1000000;
  if (mbps >= 1) {
    return `${mbps.toFixed(1)} Mbps`;
  } else {
    const kbps = bps / 1000;
    return `${kbps.toFixed(0)} kbps`;
  }
}

/**
 * 시간을 분:초.밀리초 형식으로 포맷합니다
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const centisecs = Math.floor((seconds % 1) * 100);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
}