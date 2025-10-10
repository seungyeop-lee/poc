import { useEffect, useState } from 'react';
import {
  AdvancedVideoProcessor,
  CropResizePanel,
  OutputSettingsPanel,
  TrimControls,
  VideoMetadataDisplay,
  VideoProcessingButton,
} from '../index';
import { extractVideoMetadata, type VideoMetadata } from '../../utils/videoMetadata';
import { useVideoCropControls } from '../../hooks/useVideoCropControls';
import { useVideoTrimControls } from '../../hooks/useVideoTrimControls';
import { useVideoOutputSettings } from '../../hooks/useVideoOutputSettings';
import { useVideoProcessingState } from '../../hooks/useVideoProcessingState';
import { useVideoCropStore } from '../../stores/videoCropStore';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface VideoControlsPanelProps {
  file: File | null;
  croppedAreaPixels: Area | null;
  onCropAndTrim: () => void;
}

export default function VideoControlsPanel({
  file,
  croppedAreaPixels,
  onCropAndTrim,
}: VideoControlsPanelProps) {
  // 커스텀 훅을 통해 Zustand 스토어에서 직접 상태 구독
  const { zoom, aspect, scale, setZoom, setAspect, setScale } = useVideoCropControls();
  const { startTime, endTime, duration, setStartTime, setEndTime } = useVideoTrimControls();
  const { outputFormat, selectedCodec, supportedFormats, setOutputFormat, setSelectedCodec } = useVideoOutputSettings();
  const { isProcessing, progress } = useVideoProcessingState();
  const setCodecOptions = useVideoCropStore((state) => state.setCodecOptions);
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata | null>(null);

  useEffect(() => {
    if (file) {
      extractVideoMetadata(file).then(setVideoMetadata).catch(console.error);
    } else {
      setVideoMetadata(null);
    }
  }, [file]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 비디오 정보 표시 */}
      {file && <VideoMetadataDisplay file={file} />}

      <CropResizePanel
        zoom={zoom}
        onZoomChange={setZoom}
        aspect={aspect}
        onAspectChange={setAspect}
        scale={scale || 1}
        onScaleChange={setScale}
        cropAreaWidth={croppedAreaPixels?.width || 0}
        cropAreaHeight={croppedAreaPixels?.height || 0}
      />

      {duration > 0 && (
        <TrimControls
          startTime={startTime}
          endTime={endTime}
          duration={duration}
          onStartTimeChange={setStartTime}
          onEndTimeChange={setEndTime}
        />
      )}

      <OutputSettingsPanel
        outputFormat={outputFormat}
        selectedCodec={selectedCodec}
        supportedFormats={supportedFormats}
        onFormatChange={setOutputFormat}
        onCodecChange={setSelectedCodec}
        disabled={isProcessing}
      />

      {/* 고급 비디오 처리 옵션 */}
      <AdvancedVideoProcessor
        metadata={videoMetadata}
        selectedCodec={selectedCodec}
        onOptionsChange={setCodecOptions}
      />

      {/* 비디오 처리 버튼 */}
      <VideoProcessingButton
        isProcessing={isProcessing}
        progress={progress}
        onCropAndTrim={onCropAndTrim}
        disabled={!file || !croppedAreaPixels}
      />
    </div>
  );
}
