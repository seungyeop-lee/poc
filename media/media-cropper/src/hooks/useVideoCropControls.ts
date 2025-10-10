import { useVideoCropStore } from '../stores/videoCropStore';

/**
 * 비디오 크롭 및 리사이즈 제어를 위한 커스텀 훅
 * Zustand 스토어로부터 zoom, aspect, scale 상태와 setter를 직접 가져옴
 */
export function useVideoCropControls() {
  const zoom = useVideoCropStore((state) => state.zoom);
  const aspect = useVideoCropStore((state) => state.aspect);
  const scale = useVideoCropStore((state) => state.scale);
  const setZoom = useVideoCropStore((state) => state.setZoom);
  const setAspect = useVideoCropStore((state) => state.setAspect);
  const setScale = useVideoCropStore((state) => state.setScale);

  return { zoom, aspect, scale, setZoom, setAspect, setScale };
}
