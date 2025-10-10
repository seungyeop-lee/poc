import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ErrorState, PageHeader, PageLayout, VideoControlsPanel, VideoPlayerSection } from '../components/index.ts';
import { checkWebCodecsSupport, cropAndTrimVideo } from '../utils/cropVideo.ts';
import { downloadBlob } from '../utils/cropImage.ts';
import { checkVideoFormatSupport } from '../utils/checkFormatSupport.ts';
import { useMediaStore } from '../stores/mediaStore.ts';
import { useVideoCropStore } from '../stores/videoCropStore.ts';

interface Point {
  x: number;
  y: number;
}

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

  // VideoPlayerSection에서 사용하는 상태만 구독
  const crop = useVideoCropStore((state) => state.crop);
  const zoom = useVideoCropStore((state) => state.zoom);
  const aspect = useVideoCropStore((state) => state.aspect);
  const croppedAreaPixels = useVideoCropStore((state) => state.croppedAreaPixels);
  const duration = useVideoCropStore((state) => state.duration);
  const startTime = useVideoCropStore((state) => state.startTime);
  const endTime = useVideoCropStore((state) => state.endTime);
  const liveCurrentTime = useVideoCropStore((state) => state.liveCurrentTime);

  // VideoCropPage에서 직접 사용하는 상태와 setter
  const croppedVideoUrl = useVideoCropStore((state) => state.croppedVideoUrl);
  const scale = useVideoCropStore((state) => state.scale);
  const outputWidth = useVideoCropStore((state) => state.outputWidth);
  const outputHeight = useVideoCropStore((state) => state.outputHeight);
  const outputFormat = useVideoCropStore((state) => state.outputFormat);
  const codecOptions = useVideoCropStore((state) => state.codecOptions);
  const selectedCodec = useVideoCropStore((state) => state.selectedCodec);

  const setCrop = useVideoCropStore((state) => state.setCrop);
  const setZoom = useVideoCropStore((state) => state.setZoom);
  const setCroppedAreaPixels = useVideoCropStore((state) => state.setCroppedAreaPixels);
  const setDuration = useVideoCropStore((state) => state.setDuration);
  const setEndTime = useVideoCropStore((state) => state.setEndTime);
  const setCroppedVideoUrl = useVideoCropStore((state) => state.setCroppedVideoUrl);
  const setIsProcessing = useVideoCropStore((state) => state.setIsProcessing);
  const setProgress = useVideoCropStore((state) => state.setProgress);
  const setOutputWidth = useVideoCropStore((state) => state.setOutputWidth);
  const setOutputHeight = useVideoCropStore((state) => state.setOutputHeight);
  const setSupportedFormats = useVideoCropStore((state) => state.setSupportedFormats);
  const setLiveCurrentTime = useVideoCropStore((state) => state.setLiveCurrentTime);
  const cleanup = useVideoCropStore((state) => state.cleanup);

  const [webCodecsSupported] = useState(checkWebCodecsSupport());

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

  const onCropComplete = useCallback((_: Point, croppedAreaPixels: Area) => {
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
        codecOptions && Object.keys(codecOptions).length > 0
          ? { ...codecOptions, codec: selectedCodec }
          : { codec: selectedCodec },
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

  if (!webCodecsSupported) {
    return (
      <PageLayout centered={true}>
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
    navigate('/');
    return null;
  }

  return (
    <PageLayout>
      <PageHeader title="비디오 크롭 및 트림" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 비디오 플레이어 섹션 - 1100px 이상에서 2열 차지 */}
        <div className="lg:col-span-2 xl:col-span-2 space-y-4">
          <VideoPlayerSection
            fileUrl={fileUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            duration={duration}
            liveCurrentTime={liveCurrentTime}
            startTime={startTime}
            endTime={endTime}
            onDurationChange={setDuration}
            onEndTimeChange={setEndTime}
            onLiveCurrentTimeChange={setLiveCurrentTime}
          />
        </div>

        {/* 컨트롤 패널 및 미리보기 섹션 - 1100px 이상에서 2열 차지 */}
        <div className="lg:col-span-2 space-y-4">
          <VideoControlsPanel
            file={file}
            croppedAreaPixels={croppedAreaPixels}
            onCropAndTrim={handleCropAndTrim}
          />

          {/* 미리보기 섹션 */}
          {croppedVideoUrl && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="font-medium text-gray-900 mb-3">처리 결과 미리보기</h3>
              <video src={croppedVideoUrl} controls className="w-full rounded border" style={{ maxHeight: '300px' }} />
              <button
                onClick={handleDownload}
                className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                다운로드
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

export default VideoCropPage;
