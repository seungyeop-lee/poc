import { useVideoCropStore } from '../stores/videoCropStore';

/**
 * 비디오 트림 제어를 위한 커스텀 훅
 * Zustand 스토어로부터 startTime, endTime, duration 상태와 setter를 직접 가져옴
 */
export function useVideoTrimControls() {
  const startTime = useVideoCropStore((state) => state.startTime);
  const endTime = useVideoCropStore((state) => state.endTime);
  const duration = useVideoCropStore((state) => state.duration);
  const setStartTime = useVideoCropStore((state) => state.setStartTime);
  const setEndTime = useVideoCropStore((state) => state.setEndTime);

  return { startTime, endTime, duration, setStartTime, setEndTime };
}
