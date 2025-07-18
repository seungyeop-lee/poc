/**
 * 공통 유틸리티 함수들
 */

/**
 * 시간을 MM:SS 형식으로 포맷팅
 */
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 파일 크기를 읽기 쉬운 형태로 변환
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * URL에서 Blob 생성
 */
export const createBlobFromUrl = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  return response.blob();
};

/**
 * 오버레이 위치 계산
 */
export const calculateOverlayPosition = (
  canvasWidth: number, 
  canvasHeight: number, 
  overlaySize: number, 
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right',
  margin: number = 20
): { x: number; y: number } => {
  switch (position) {
    case 'top-left':
      return { x: margin, y: margin };
    case 'top-right':
      return { x: canvasWidth - overlaySize - margin, y: margin };
    case 'bottom-left':
      return { x: margin, y: canvasHeight - overlaySize - margin };
    case 'bottom-right':
      return { x: canvasWidth - overlaySize - margin, y: canvasHeight - overlaySize - margin };
    default:
      return { x: canvasWidth - overlaySize - margin, y: margin };
  }
};

/**
 * 미디어 스트림 정리
 */
export const cleanupMediaStream = (stream: MediaStream | null): void => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

/**
 * Object URL 정리
 */
export const cleanupObjectUrl = (url: string | null): void => {
  if (url) {
    URL.revokeObjectURL(url);
  }
};