import { useVideoCropStore } from '../stores/videoCropStore';

/**
 * 비디오 처리 상태 제어를 위한 커스텀 훅
 * Zustand 스토어로부터 isProcessing, progress 상태를 직접 가져옴
 */
export function useVideoProcessingState() {
  const isProcessing = useVideoCropStore((state) => state.isProcessing);
  const progress = useVideoCropStore((state) => state.progress);

  return { isProcessing, progress };
}
