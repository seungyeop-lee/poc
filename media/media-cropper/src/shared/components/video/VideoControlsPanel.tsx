import { useEffect, useState } from 'react';
import { extractVideoMetadata, type VideoMetadata } from '../../utils/videoMetadata.ts';
import { useVideoCropStore } from '../../../pages/video/videoCropStore.ts';
import { useShallow } from 'zustand/shallow';
import VideoMetadataDisplay from './VideoMetadataDisplay.tsx';
import CropResizePanel from '../form/CropResizePanel.tsx';
import TrimControls from '../form/TrimControls.tsx';
import VideoOutputSettingsPanel from '../form/VideoOutputSettingsPanel.tsx';
import AdvancedVideoProcessor from './AdvancedVideoProcessor.tsx';
import VideoProcessingButton from './VideoProcessingButton.tsx';

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

export default function VideoControlsPanel({ file, croppedAreaPixels, onCropAndTrim }: VideoControlsPanelProps) {
  // CropResizePanel 에서 사용하는 상태만 구독
  const { zoom, aspect, scale } = useVideoCropStore(
    useShallow((state) => ({
      zoom: state.zoom,
      aspect: state.aspect,
      scale: state.scale,
    })),
  );

  // TrimControls 에서 사용하는 상태만 구독
  const { startTime, endTime, duration } = useVideoCropStore(
    useShallow((state) => ({
      startTime: state.startTime,
      endTime: state.endTime,
      duration: state.duration,
    })),
  );

  // VideoOutputSettingsPanel 에서 사용하는 상태만 구독
  const { outputFormat, selectedCodec, supportedFormats } = useVideoCropStore(
    useShallow((state) => ({
      outputFormat: state.outputFormat,
      selectedCodec: state.selectedCodec,
      supportedFormats: state.supportedFormats,
    })),
  );

  // VideoProcessingButton 에서 사용하는 상태만 구독
  const { isProcessing, progress } = useVideoCropStore(
    useShallow((state) => ({
      isProcessing: state.isProcessing,
      progress: state.progress,
    })),
  );

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
        onZoomChange={(zoom) => {
          useVideoCropStore.setState({ zoom: zoom });
        }}
        aspect={aspect}
        onAspectChange={(aspect) => {
          useVideoCropStore.setState({ aspect: aspect });
        }}
        scale={scale || 1}
        onScaleChange={(scale) => {
          useVideoCropStore.getState().changeScale(scale);
        }}
        cropAreaWidth={croppedAreaPixels?.width || 0}
        cropAreaHeight={croppedAreaPixels?.height || 0}
      />

      {duration > 0 && (
        <TrimControls
          startTime={startTime}
          endTime={endTime}
          duration={duration}
          onStartTimeChange={(time) => {
            useVideoCropStore.setState({ startTime: time });
          }}
          onEndTimeChange={(time) => {
            useVideoCropStore.setState({ endTime: time });
          }}
        />
      )}

      <VideoOutputSettingsPanel
        outputFormat={outputFormat}
        selectedCodec={selectedCodec}
        supportedFormats={supportedFormats}
        onFormatChange={(format) => {
          useVideoCropStore.getState().setOutputFormat(format);
        }}
        onCodecChange={(selectedCodec) => {
          useVideoCropStore.setState({ selectedCodec });
        }}
        disabled={isProcessing}
      />

      {/* 고급 비디오 처리 옵션 */}
      <AdvancedVideoProcessor
        metadata={videoMetadata}
        selectedCodec={selectedCodec}
        onOptionsChange={(options) => {
          useVideoCropStore.setState({ codecOptions: options });
        }}
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
