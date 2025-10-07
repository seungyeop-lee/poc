import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import Cropper from 'react-easy-crop';
import {
  CropControls,
  ErrorState,
  FormatSelector,
  LoadingSpinner,
  MediaPreview,
  PageHeader,
  PageLayout,
  ResizeScaleSlider,
  TrimControls,
} from '../components/index.ts';
import { checkWebCodecsSupport, cropAndTrimVideo } from '../utils/cropVideo.ts';
import { downloadBlob } from '../utils/cropImage.ts';
import { checkVideoFormatSupport } from '../utils/checkFormatSupport.ts';
import { useMediaStore } from '../stores/mediaStore.ts';
import { useVideoCropStore } from '../stores/videoCropStore.ts';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function VideoCropPage() {
  const navigate = useNavigate();
  const file = useMediaStore((state) => state.file);
  const fileUrl = useMediaStore((state) => state.fileUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  const crop = useVideoCropStore((state) => state.crop);
  const zoom = useVideoCropStore((state) => state.zoom);
  const aspect = useVideoCropStore((state) => state.aspect);
  const croppedAreaPixels = useVideoCropStore((state) => state.croppedAreaPixels);
  const duration = useVideoCropStore((state) => state.duration);
  const startTime = useVideoCropStore((state) => state.startTime);
  const endTime = useVideoCropStore((state) => state.endTime);
  const croppedVideoUrl = useVideoCropStore((state) => state.croppedVideoUrl);
  const isProcessing = useVideoCropStore((state) => state.isProcessing);
  const progress = useVideoCropStore((state) => state.progress);
  const scale = useVideoCropStore((state) => state.scale);
  const outputWidth = useVideoCropStore((state) => state.outputWidth);
  const outputHeight = useVideoCropStore((state) => state.outputHeight);
  const outputFormat = useVideoCropStore((state) => state.outputFormat);
  const supportedFormats = useVideoCropStore((state) => state.supportedFormats);
  const liveCurrentTime = useVideoCropStore((state) => state.liveCurrentTime);

  const setCrop = useVideoCropStore((state) => state.setCrop);
  const setZoom = useVideoCropStore((state) => state.setZoom);
  const setAspect = useVideoCropStore((state) => state.setAspect);
  const setCroppedAreaPixels = useVideoCropStore((state) => state.setCroppedAreaPixels);
  const setDuration = useVideoCropStore((state) => state.setDuration);
  const setStartTime = useVideoCropStore((state) => state.setStartTime);
  const setEndTime = useVideoCropStore((state) => state.setEndTime);
  const setCroppedVideoUrl = useVideoCropStore((state) => state.setCroppedVideoUrl);
  const setIsProcessing = useVideoCropStore((state) => state.setIsProcessing);
  const setProgress = useVideoCropStore((state) => state.setProgress);
  const setScale = useVideoCropStore((state) => state.setScale);
  const setOutputWidth = useVideoCropStore((state) => state.setOutputWidth);
  const setOutputHeight = useVideoCropStore((state) => state.setOutputHeight);
  const setOutputFormat = useVideoCropStore((state) => state.setOutputFormat);
  const setSupportedFormats = useVideoCropStore((state) => state.setSupportedFormats);
  const setLiveCurrentTime = useVideoCropStore((state) => state.setLiveCurrentTime);
  const cleanup = useVideoCropStore((state) => state.cleanup);

  const [webCodecsSupported] = useState(checkWebCodecsSupport());

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
        setEndTime(video.duration);
      });
    }
  }, [setDuration, setEndTime]);

  useEffect(() => {
    const formats = ['video/webm', 'video/mp4'];
    const supported = formats.filter(checkVideoFormatSupport);
    setSupportedFormats(supported);
  }, [setSupportedFormats]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  useEffect(() => {
    if (croppedAreaPixels) {
      setOutputWidth(Math.round(croppedAreaPixels.width * scale));
      setOutputHeight(Math.round(croppedAreaPixels.height * scale));
    }
  }, [scale, croppedAreaPixels]);

  const handleCropAndTrim = async () => {
    if (!file || !croppedAreaPixels) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const blob = await cropAndTrimVideo(
        file,
        croppedAreaPixels,
        { start: startTime, end: endTime },
        outputWidth,
        outputHeight,
        outputFormat,
        (p) => setProgress(p),
      );
      const url = URL.createObjectURL(blob);
      setCroppedVideoUrl(url);
    } catch (error) {
      console.error('Video processing failed:', error);
      alert('비디오 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (croppedVideoUrl) {
      fetch(croppedVideoUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const ext = outputFormat.split('/')[1];
          downloadBlob(blob, `cropped-video-${Date.now()}.${ext}`);
        });
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  };

  const handleVideoTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      setLiveCurrentTime(video.currentTime);

      // 트림 구간 반복 재생: endTime을 초과하면 startTime으로 되돌림
      if (endTime > 0 && video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
    },
    [startTime, endTime],
  );

  if (!webCodecsSupported) {
    return (
      <PageLayout>
        <ErrorState
          title="지원되지 않는 브라우저"
          message="비디오 크롭 기능은 Chrome 94+, Edge 94+, Firefox 133+에서만 사용 가능합니다."
          variant="card"
          action={{
            label: '홈으로 돌아가기',
            onClick: () => navigate('/'),
          }}
        />
      </PageLayout>
    );
  }

  if (!file || !fileUrl) {
    return (
      <PageLayout>
        <ErrorState
          message="파일이 선택되지 않았습니다."
          action={{
            label: '홈으로 돌아가기',
            onClick: () => navigate('/'),
          }}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <video ref={videoRef} src={fileUrl} className="hidden" />

      <PageHeader title="비디오 크롭 및 트림" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px', position: 'relative' }}>
            <Cropper
              video={fileUrl}
              crop={crop}
              zoom={zoom}
              aspect={aspect || undefined}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={true}
              mediaProps={{
                onTimeUpdate: handleVideoTimeUpdate,
              }}
            />
          </div>
          {duration > 0 && (
            <div className="mt-2 text-sm text-gray-600 text-center bg-white p-2 rounded shadow">
              재생 시간: {formatTime(liveCurrentTime)} / {formatTime(duration)}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <CropControls zoom={zoom} onZoomChange={setZoom} aspect={aspect} onAspectChange={setAspect} />

          {duration > 0 && (
            <TrimControls
              startTime={startTime}
              endTime={endTime}
              duration={duration}
              onStartTimeChange={setStartTime}
              onEndTimeChange={setEndTime}
            />
          )}

          {croppedAreaPixels && (
            <ResizeScaleSlider
              scale={scale}
              onScaleChange={setScale}
              cropAreaWidth={croppedAreaPixels.width}
              cropAreaHeight={croppedAreaPixels.height}
            />
          )}

          <FormatSelector
            mediaType="video"
            selectedFormat={outputFormat}
            onFormatChange={setOutputFormat}
            supportedFormats={supportedFormats}
          />

          <button
            onClick={handleCropAndTrim}
            disabled={isProcessing}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isProcessing ? (
              <LoadingSpinner size="small" message="처리 중..." progress={progress} />
            ) : (
              '크롭 및 트림 실행'
            )}
          </button>

          {croppedVideoUrl && <MediaPreview mediaType="video" src={croppedVideoUrl} onDownload={handleDownload} />}
        </div>
      </div>
    </PageLayout>
  );
}

export default VideoCropPage;
