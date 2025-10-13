import { create } from 'zustand';

interface MediaStore {
  file: File | null;
  fileUrl: string | null;
  setMedia: (file: File) => void;
  clearMedia: () => void;
}

export const useMediaStore = create<MediaStore>((set, get, store) => ({
  file: null,
  fileUrl: null,
  setMedia: (file) => {
    // 기존 fileUrl 정리
    const prevFileUrl = get().fileUrl;
    if (prevFileUrl) {
      URL.revokeObjectURL(prevFileUrl);
    }

    const fileUrl = URL.createObjectURL(file);
    set({ file, fileUrl });
  },
  clearMedia: () => {
    const fileUrl = get().fileUrl;
    if (fileUrl) {
      URL.revokeObjectURL(fileUrl);
    }

    set(store.getInitialState());
  },
}));
