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
  changeCropArea: (area: Area) => void;
  changeScale: (scale: number) => void;
  applyOutputWH: () => void;
  cleanUp: () => void;
}

export const useImageCropStore = create<ImageCropStore>((set, get, store) => ({
  // 초기값
  crop: { x: 0, y: 0 },
  zoom: 1,
  aspect: 4 / 3,
  croppedAreaPixels: null,
  scale: 1.0,
  outputWidth: 800,
  outputHeight: 600,
  outputFormat: 'image/png',
  isProcessing: false,
  croppedImageUrl: null,
  supportedFormats: [],

  // 액션 구현
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
    const { croppedImageUrl } = get();
    if (croppedImageUrl) {
      URL.revokeObjectURL(croppedImageUrl);
    }
    set(store.getInitialState());
  },
}));
