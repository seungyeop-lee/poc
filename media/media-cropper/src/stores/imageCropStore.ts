import { create } from 'zustand';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropStore {
  // 크롭 관련 상태
  crop: { x: number; y: number };
  zoom: number;
  aspect: number;
  croppedAreaPixels: Area | null;

  // 출력 설정 상태
  scale: number;
  outputWidth: number;
  outputHeight: number;
  outputFormat: string;

  // 처리 상태
  isProcessing: boolean;
  croppedImageUrl: string | null;

  // 포맷 지원 상태
  supportedFormats: string[];

  // 액션
  setCrop: (crop: { x: number; y: number }) => void;
  setZoom: (zoom: number) => void;
  setAspect: (aspect: number) => void;
  setCroppedAreaPixels: (area: Area | null) => void;
  setScale: (scale: number) => void;
  setOutputWidth: (width: number) => void;
  setOutputHeight: (height: number) => void;
  setOutputFormat: (format: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setCroppedImageUrl: (url: string | null) => void;
  setSupportedFormats: (formats: string[]) => void;
  clearState: () => void;
  cleanup: () => void;
}

export const useImageCropStore = create<ImageCropStore>((set, get) => ({
  // 초기값
  crop: { x: 0, y: 0 },
  zoom: 1,
  aspect: 4 / 3,
  croppedAreaPixels: null,
  scale: 1.0,
  outputWidth: 800,
  outputHeight: 600,
  outputFormat: 'image/jpeg',
  isProcessing: false,
  croppedImageUrl: null,
  supportedFormats: [],

  // 액션 구현
  setCrop: (crop) => set({ crop }),
  setZoom: (zoom) => set({ zoom }),
  setAspect: (aspect) => set({ aspect }),
  setCroppedAreaPixels: (area) => set({ croppedAreaPixels: area }),
  setScale: (scale) => set({ scale }),
  setOutputWidth: (width) => set({ outputWidth: width }),
  setOutputHeight: (height) => set({ outputHeight: height }),
  setOutputFormat: (format) => set({ outputFormat: format }),
  setIsProcessing: (isProcessing) => set({ isProcessing }),
  setCroppedImageUrl: (url) => set({ croppedImageUrl: url }),
  setSupportedFormats: (formats) => set({ supportedFormats: formats }),

  clearState: () => {
    set({
      crop: { x: 0, y: 0 },
      zoom: 1,
      aspect: 4 / 3,
      croppedAreaPixels: null,
      scale: 1.0,
      outputWidth: 800,
      outputHeight: 600,
      outputFormat: 'image/jpeg',
      isProcessing: false,
      croppedImageUrl: null,
      supportedFormats: [],
    });
  },

  cleanup: () => {
    const { croppedImageUrl } = get();
    if (croppedImageUrl) {
      URL.revokeObjectURL(croppedImageUrl);
    }
    set({ croppedImageUrl: null });
  },
}));
