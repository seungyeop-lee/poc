import { create } from 'zustand';

interface MediaStore {
  file: File | null;
  fileUrl: string | null;
  setMedia: (file: File, fileUrl: string) => void;
  clearMedia: () => void;
}

export const useMediaStore = create<MediaStore>((set, get) => ({
  file: null,
  fileUrl: null,
  setMedia: (file, fileUrl) => {
    // 기존 fileUrl 정리
    const prevFileUrl = get().fileUrl;
    if (prevFileUrl) {
      URL.revokeObjectURL(prevFileUrl);
    }
    set({ file, fileUrl });
  },
  clearMedia: () => {
    const fileUrl = get().fileUrl;
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }
    set({ file: null, fileUrl: null });
  },
}));
