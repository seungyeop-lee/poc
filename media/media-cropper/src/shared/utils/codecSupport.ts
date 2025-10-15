import {
  getEncodableVideoCodecs,
  getEncodableAudioCodecs,
  getFirstEncodableVideoCodec,
  getFirstEncodableAudioCodec,
  canEncodeVideo,
  canEncode,
  Mp4OutputFormat,
  WebMOutputFormat
} from 'mediabunny';

export interface CodecInfo {
  name: string;
  type: 'video' | 'audio';
  supported: boolean;
  description?: string;
}

export interface FormatCompatibility {
  format: string;
  mimeType: string;
  videoCodec?: string;
  audioCodec?: string;
  compatible: boolean;
  recommended: boolean;
}

/**
 * 지원되는 모든 코덱 정보를 가져옵니다
 */
export async function getSupportedCodecs(): Promise<CodecInfo[]> {
  try {
    const [videoCodecs, audioCodecs] = await Promise.all([
      getEncodableVideoCodecs(),
      getEncodableAudioCodecs()
    ]);

    const codecMap = new Map<string, CodecInfo>();

    // 비디오 코덱 추가
    videoCodecs.forEach(codec => {
      codecMap.set(codec.toString(), {
        name: codec.toString(),
        type: 'video',
        supported: true,
        description: getCodecDescription(codec.toString())
      });
    });

    // 오디오 코덱 추가
    audioCodecs.forEach(codec => {
      codecMap.set(codec.toString(), {
        name: codec.toString(),
        type: 'audio',
        supported: true,
        description: getCodecDescription(codec.toString())
      });
    });

    return Array.from(codecMap.values());
  } catch (error) {
    console.error('코덱 정보 가져오기 실패:', error);
    return [];
  }
}

/**
 * 특정 코덱의 지원 여부를 확인합니다
 */
export async function checkCodecSupport(codecName: string, config?: {
  width?: number;
  height?: number;
  bitrate?: number;
}): Promise<boolean> {
  try {
    if (config) {
      return await canEncodeVideo(codecName as 'avc' | 'hevc' | 'vp9' | 'av1' | 'vp8', config);
    }
    return await canEncode(codecName as 'avc' | 'hevc' | 'vp9' | 'av1' | 'vp8');
  } catch (error) {
    console.error(`코덱 지원 확인 실패 (${codecName}):`, error);
    return false;
  }
}

/**
 * 출력 포맷별 호환성을 확인합니다
 */
export async function getFormatCompatibility(): Promise<FormatCompatibility[]> {
  const formats = [
    { format: 'MP4', mimeType: 'video/mp4' },
    { format: 'WebM', mimeType: 'video/webm' }
  ];

  const compatibility: FormatCompatibility[] = [];

  for (const format of formats) {
    try {
      const videoCodec = await getFirstEncodableVideoCodec(['avc', 'vp9', 'av1']);
      const audioCodec = await getFirstEncodableAudioCodec(['aac', 'opus', 'mp3']);

      const compatible = !!(videoCodec || audioCodec);
      const recommended = !!(format.format === 'MP4' && videoCodec?.toString().includes('avc'));

      compatibility.push({
        format: format.format,
        mimeType: format.mimeType,
        videoCodec: videoCodec?.toString(),
        audioCodec: audioCodec?.toString(),
        compatible: compatible || false,
        recommended
      });
    } catch (error) {
      console.error(`포맷 호환성 확인 실패 (${format.format}):`, error);
      compatibility.push({
        format: format.format,
        mimeType: format.mimeType,
        compatible: false,
        recommended: false
      });
    }
  }

  return compatibility;
}

/**
 * 최적의 코덱 조합을 추천합니다
 */
export async function getRecommendedCodecs(): Promise<{
  video: string | null;
  audio: string | null;
  format: string;
}> {
  try {
    const [bestVideo, bestAudio, compatibility] = await Promise.all([
      getFirstEncodableVideoCodec(['avc', 'vp9', 'av1']),
      getFirstEncodableAudioCodec(['aac', 'opus', 'mp3']),
      getFormatCompatibility()
    ]);

    const recommendedFormat = compatibility.find(f => f.recommended)?.format || 'MP4';

    return {
      video: bestVideo?.toString() || null,
      audio: bestAudio?.toString() || null,
      format: recommendedFormat
    };
  } catch (error) {
    console.error('최적 코덱 추천 실패:', error);
    return {
      video: null,
      audio: null,
      format: 'MP4'
    };
  }
}

/**
 * 코덱 설명을 가져옵니다
 */
function getCodecDescription(codec: string): string {
  const descriptions: Record<string, string> = {
    'avc': 'H.264/AVC - 가장 널리 지원되는 비디오 코덱',
    'hevc': 'H.265/HEVC - 더 효율적인 압축률',
    'vp9': 'VP9 - Google 개발의 개방형 비디오 코덱',
    'av1': 'AV1 - 차세대 개방형 비디오 코덱',
    'aac': 'AAC - 고품질 오디오 코덱',
    'opus': 'Opus - 저지연 고품질 오디오 코덱',
    'mp3': 'MP3 - 널리 사용되는 오디오 포맷'
  };

  const codecName = codec.split('.')[0].toLowerCase();
  return descriptions[codecName] || `${codec} 코덱`;
}

/**
 * 특정 출력 포맷에 지원되는 코덱 목록을 가져옵니다 (mediabunny getSupportedCodecs API 사용)
 */
export async function getSupportedCodecsForFormat(mimeType: string): Promise<{
  video: string[];
  audio: string[];
}> {
  try {
    let outputFormat;

    // 포맷에 따른 OutputFormat 객체 생성
    if (mimeType === 'video/mp4') {
      outputFormat = new Mp4OutputFormat();
    } else if (mimeType === 'video/webm') {
      outputFormat = new WebMOutputFormat();
    } else {
      console.warn(`지원되지 않는 포맷: ${mimeType}, 기본으로 MP4 사용`);
      outputFormat = new Mp4OutputFormat();
    }

    // 포맷별 지원 코덱 목록 가져오기
    const formatVideoCodecs = outputFormat.getSupportedVideoCodecs().map(codec => codec.toString());
    const formatAudioCodecs = outputFormat.getSupportedAudioCodecs().map(codec => codec.toString());

    // 브라우저에서 인코딩 가능한 코덱 목록 가져오기
    const [encodableVideoCodecs, encodableAudioCodecs] = await Promise.all([
      getEncodableVideoCodecs(),
      getEncodableAudioCodecs()
    ]);

    const encodableVideo = encodableVideoCodecs.map(codec => codec.toString());
    const encodableAudio = encodableAudioCodecs.map(codec => codec.toString());

    // 포맷 지원 + 브라우저 인코딩 가능한 코덱만 필터링
    const supportedVideo = formatVideoCodecs.filter(codec => encodableVideo.includes(codec));
    const supportedAudio = formatAudioCodecs.filter(codec => encodableAudio.includes(codec));

    return {
      video: supportedVideo,
      audio: supportedAudio
    };
  } catch (error) {
    console.error(`포맷별 코덱 지원 확인 실패 (${mimeType}):`, error);
    return {
      video: [],
      audio: []
    };
  }
}