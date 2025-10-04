import { create } from 'zustand';

interface MediaStore {
  file: File | null;
  fileUrl: string | null;
  setMedia: (file: File, fileUrl: string) => void;
  clearMedia: () => void;
}

export const useMediaStore = create<MediaStore>((set) => ({
  file: null,
  fileUrl: null,
  setMedia: (file, fileUrl) => set({ file, fileUrl }),
  clearMedia: () => set({ file: null, fileUrl: null }),
}));
