/**
 * 비디오 편집기에서 사용되는 공통 타입 정의
 */

export interface VideoEditorProps {
  /** 업로드된 비디오 파일 */
  videoFile?: File | null;
  /** 웹캠 스트림 */
  webcamStream?: MediaStream | null;
  /** 오버레이할 이미지 파일 */
  overlayImage: File;
  /** 비디오 처리가 완료되었을 때 호출되는 콜백 */
  onVideoProcessed?: (blob: Blob) => void;
  /** 워터마크 위치 설정 */
  watermarkPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  /** 최대 파일 크기 (바이트) */
  maxFileSize?: number;
}

export interface DebugInfo {
  canvasWidth: number;
  canvasHeight: number;
  videoWidth: number;
  videoHeight: number;
  readyState: number;
  sourceType: string;
}

export interface AudioSettings {
  enabled: boolean;
  detectedElements: number;
  gainLevel: number;
}

export interface RecordingState {
  isRecording: boolean;
  recordingTime: number;
  recordedChunks: Blob[];
  downloadUrl: string | null;
}

export interface MediaUploadProps {
  onFileSelect: (file: File) => void;
  onBack?: () => void;
  maxFileSize?: number;
  acceptedFormats?: string[];
}

export interface WebcamProps {
  onStreamReady: (stream: MediaStream) => void;
  onBack?: () => void;
  videoConstraints?: MediaTrackConstraints;
  enableAudio?: boolean;
}

export type VideoSource = 'upload' | 'webcam' | null;