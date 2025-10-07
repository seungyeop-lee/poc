import { create } from 'zustand';

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
  setOutputFormat: (format) => set({ outputFormat: format }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setProgress: (progress) => set({ progress }),
  setCroppedVideoUrl: (url) => set({ croppedVideoUrl: url }),
  setSupportedFormats: (formats) => set({ supportedFormats: formats }),

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
