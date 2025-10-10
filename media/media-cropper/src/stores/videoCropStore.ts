import { create } from 'zustand';
import type { CodecSpecificOptions } from '../utils/videoMetadata';
import { getSupportedCodecsForFormat } from '../utils/codecSupport';

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
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setAspect: (aspect: number) => void;
  setCroppedAreaPixels: (area: Area | null) => void;
  setDuration: (duration: number) => void;
  setStartTime: (startTime: number) => void;
  setEndTime: (endTime: number) => void;
  setLiveCurrentTime: (currentTime: number) => void;
  setScale: (scale: number) => void;
  setOutputWidth: (width: number) => void;
  setOutputHeight: (height: number) => void;
  setOutputFormat: (format: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setProgress: (progress: number) => void;
  setCroppedVideoUrl: (url: string | null) => void;
  setSupportedFormats: (formats: string[]) => void;
  setCodecOptions: (options: CodecSpecificOptions | null) => void;
  setSelectedCodec: (codec: string) => void;
  clearState: () => void;
  cleanup: () => void;
}

export const useVideoCropStore = create<VideoCropStore>((set, get) => ({
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
  setCrop: (crop) => set({ crop }),
  setZoom: (zoom) => set({ zoom }),
  setAspect: (aspect) => set({ aspect }),
  setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),
  setDuration: (duration) => set({ duration }),
  setStartTime: (startTime) => set({ startTime }),
  setEndTime: (endTime) => set({ endTime }),
  setLiveCurrentTime: (currentTime) => set({ liveCurrentTime: currentTime }),
  setScale: (scale) => set({ scale }),
  setOutputWidth: (width) => set({ outputWidth: width }),
  setOutputHeight: (height) => set({ outputHeight: height }),
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
          'video/webm': 'vp8'
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
        'video/webm': 'vp8'
      };
      const fallbackCodec = fallbackCodecs[format] || 'vp8';
      set({ selectedCodec: fallbackCodec });
      console.log(`🔄 에러 발생으로 Fallback 코덱 선택: ${fallbackCodec}`);
    }
  },
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (progress) => set({ progress }),
  setCroppedVideoUrl: (url) => set({ croppedVideoUrl: url }),
  setSupportedFormats: (formats) => set({ supportedFormats: formats }),
  setCodecOptions: (options) => set({ codecOptions: options }),
  setSelectedCodec: (codec) => set({ selectedCodec: codec }),

  clearState: () => {
    set({
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
      selectedCodec: 'vp8',
    });
  },

  cleanup: () => {
    const { croppedVideoUrl } = get();
    if (croppedVideoUrl) {
      URL.revokeObjectURL(croppedVideoUrl);
    }
    set({ croppedVideoUrl: null });
  },
}));
