import { useVideoCropStore } from '../stores/videoCropStore';

/**
 * 비디오 출력 설정 제어를 위한 커스텀 훅
 * Zustand 스토어로부터 outputFormat, selectedCodec, supportedFormats 상태와 setter를 직접 가져옴
 */
export function useVideoOutputSettings() {
  const outputFormat = useVideoCropStore((state) => state.outputFormat);
  const selectedCodec = useVideoCropStore((state) => state.selectedCodec);
  const supportedFormats = useVideoCropStore((state) => state.supportedFormats);
  const setOutputFormat = useVideoCropStore((state) => state.setOutputFormat);
  const setSelectedCodec = useVideoCropStore((state) => state.setSelectedCodec);

  return { outputFormat, selectedCodec, supportedFormats, setOutputFormat, setSelectedCodec };
}
