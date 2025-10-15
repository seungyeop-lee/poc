import { create } from 'zustand';
import type { CodecSpecificOptions } from '../../shared/utils/videoMetadata.ts';
import { getSupportedCodecsForFormat } from '../../shared/utils/codecSupport.ts';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VideoCropStore {
  // 크롭 관련 상태
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  croppedAreaPixels: Area | null;

  // 트림 관련 상태
  duration: number;
  startTime: number;
  endTime: number;
  liveCurrentTime: number;

  // 출력 설정 상태
  scale: number;
  outputWidth: number;
  outputHeight: number;
  outputFormat: string;

  // 처리 상태
  isProcessing: boolean;
  progress: number;
  croppedVideoUrl: string | null;

  // 포맷 지원 상태
  supportedFormats: string[];

  // 비디오 처리 옵션
  codecOptions: CodecSpecificOptions | null;

  // 코덱 선택
  selectedCodec: string;

  // 액션
  setCroppedAreaPixels: (area: Area | null) => void;
  setLiveCurrentTime: (currentTime: number) => void;
  setOutputFormat: (format: string) => void;
  setCroppedVideoUrl: (url: string | null) => void;
  setSupportedFormats: (formats: string[]) => void;
  setCodecOptions: (options: CodecSpecificOptions | null) => void;
  setSelectedCodec: (codec: string) => void;
  changeCropArea: (area: Area) => void;
  changeScale: (scale: number) => void;
  applyOutputWH: () => void;
  cleanUp: () => void;
}

export const useVideoCropStore = create<VideoCropStore>((set, get, store) => ({
  // 초기값
  crop: { x: 0, y: 0 },
  zoom: 1,
  aspect: 16 / 9,
  croppedAreaPixels: null,
  duration: 0,
  startTime: 0,
  endTime: 0,
  liveCurrentTime: 0,
  scale: 1.0,
  outputWidth: 1280,
  outputHeight: 720,
  outputFormat: 'video/webm',
  isProcessing: false,
  progress: 0,
  croppedVideoUrl: null,
  supportedFormats: [],
  codecOptions: null,
  selectedCodec: 'vp8', // 기본값

  // 액션 구현
  setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),
  setLiveCurrentTime: (currentTime) => set({ liveCurrentTime: currentTime }),
  setOutputFormat: async (format: string) => {
    // 포맷 설정
    set({ outputFormat: format });

    try {
      // 해당 포맷에 맞는 코덱 목록 가져오기
      const supportedCodecs = await getSupportedCodecsForFormat(format);

      if (supportedCodecs.video.length > 0) {
        // 첫 번째 호환 코덱 자동 선택
        const firstCompatibleCodec = supportedCodecs.video[0];
        set({ selectedCodec: firstCompatibleCodec });
        console.log(`🎯 포맷 ${format}에 맞는 코덱 자동 선택: ${firstCompatibleCodec}`);
      } else {
        console.warn(`⚠️ 포맷 ${format}에 지원되는 코덱이 없습니다.`);
        // fallback 코덱 설정
        const fallbackCodecs: Record<string, string> = {
          'video/mp4': 'avc1',
          'video/webm': 'vp8',
        };
        const fallbackCodec = fallbackCodecs[format] || 'vp8';
        set({ selectedCodec: fallbackCodec });
        console.log(`🔄 Fallback 코덱 선택: ${fallbackCodec}`);
      }
    } catch (error) {
      console.error('❌ 코덱 자동 선택 실패:', error);
      // 실패 시 기본 코덱으로 fallback
      const fallbackCodecs: Record<string, string> = {
        'video/mp4': 'avc1',
        'video/webm': 'vp8',
      };
      const fallbackCodec = fallbackCodecs[format] || 'vp8';
      set({ selectedCodec: fallbackCodec });
      console.log(`🔄 에러 발생으로 Fallback 코덱 선택: ${fallbackCodec}`);
    }
  },
  setCroppedVideoUrl: (url) => set({ croppedVideoUrl: url }),
  setSupportedFormats: (formats) => set({ supportedFormats: formats }),
  setCodecOptions: (options) => set({ codecOptions: options }),
  setSelectedCodec: (codec) => set({ selectedCodec: codec }),
  changeCropArea: (area: Area) => {
    set({ croppedAreaPixels: area });
    get().applyOutputWH();
  },
  changeScale: (scale: number) => {
    set({ scale: scale });
    get().applyOutputWH();
  },
  applyOutputWH: () => {
    const { croppedAreaPixels, scale } = get();
    if (!croppedAreaPixels) {
      return;
    }
    set({
      outputWidth: Math.round(croppedAreaPixels.width * scale),
      outputHeight: Math.round(croppedAreaPixels.height * scale),
    });
  },

  cleanUp: () => {
    const { croppedVideoUrl } = get();
    if (croppedVideoUrl) {
      URL.revokeObjectURL(croppedVideoUrl);
    }
    set(store.getInitialState());
  },
}));
