import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useShallow } from 'zustand/shallow';
import { ErrorState, PageHeader, PageLayout, VideoControlsPanel, VideoPlayerSection } from '../components/index.ts';
import { checkWebCodecsSupport, cropAndTrimVideo } from '../utils/cropVideo.ts';
import { checkVideoFormatSupport } from '../utils/checkFormatSupport.ts';
import { useMediaStore } from '../stores/mediaStore.ts';
import { useVideoCropStore } from './videoCropStore.ts';
import { downloadBlob } from '../utils/blob.ts';
import type { Area } from 'react-easy-crop';

function VideoCropPage() {
  const navigate = useNavigate();
  const file = useMediaStore((state) => state.file);
  const fileUrl = useMediaStore((state) => state.fileUrl);

  // VideoPlayerSection에서 사용하는 상태만 구독
  const { crop, zoom, aspect, croppedAreaPixels, duration, startTime, endTime, liveCurrentTime } = useVideoCropStore(
    useShallow((state) => ({
      crop: state.crop,
      zoom: state.zoom,
      aspect: state.aspect,
      croppedAreaPixels: state.croppedAreaPixels,
      duration: state.duration,
      startTime: state.startTime,
      endTime: state.endTime,
      liveCurrentTime: state.liveCurrentTime,
    })),
  );

  // VideoCropPage에서 직접 사용하는 상태
  const { croppedVideoUrl, outputWidth, outputHeight, outputFormat, codecOptions, selectedCodec } = useVideoCropStore(
    useShallow((state) => ({
      croppedVideoUrl: state.croppedVideoUrl,
      outputWidth: state.outputWidth,
      outputHeight: state.outputHeight,
      outputFormat: state.outputFormat,
      codecOptions: state.codecOptions,
      selectedCodec: state.selectedCodec,
    })),
  );

  // Setter 함수들
  const { setIsProcessing, setProgress } = useVideoCropStore(
    useShallow((state) => ({
      setIsProcessing: state.setIsProcessing,
      setProgress: state.setProgress,
    })),
  );

  const [webCodecsSupported] = useState(checkWebCodecsSupport());

  useEffect(() => {
    if (!fileUrl) {
      navigate('/');
    }
  }, [fileUrl, navigate]);

  useEffect(() => {
    const formats = ['video/webm', 'video/mp4'];
    const supported = formats.filter(checkVideoFormatSupport);
    useVideoCropStore.setState({ supportedFormats: supported });

    return () => {
      useVideoCropStore.getState().cleanUp();
    };
  }, []);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    useVideoCropStore.getState().changeCropArea(croppedAreaPixels);
  }, []);

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
      useVideoCropStore.setState({ croppedVideoUrl: url });
    } catch (error) {
      console.error('Video processing failed:', error);
      alert('비디오 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!croppedVideoUrl) {
      return;
    }

    const res = await fetch(croppedVideoUrl);
    if (!res.ok) {
      alert('다운로드를 위한 파일을 불러오는 중 오류가 발생했습니다.');
      return;
    }

    const blob = await res.blob();
    const ext = outputFormat.split('/')[1];
    downloadBlob(blob, `${file?.name}-${outputWidth}x${outputHeight}.${ext}`);
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
            onCropChange={(crop) => {
              useVideoCropStore.setState({ crop });
            }}
            onZoomChange={(zoom) => {
              useVideoCropStore.setState({ zoom });
            }}
            onCropComplete={onCropComplete}
            duration={duration}
            liveCurrentTime={liveCurrentTime}
            startTime={startTime}
            endTime={endTime}
            onDurationChange={(duration) => {
              useVideoCropStore.setState({ duration });
            }}
            onEndTimeChange={(endTime) => {
              useVideoCropStore.setState({ endTime });
            }}
            onLiveCurrentTimeChange={(time) => {
              useVideoCropStore.setState({ liveCurrentTime: time });
            }}
          />
        </div>

        {/* 컨트롤 패널 및 미리보기 섹션 - 1100px 이상에서 2열 차지 */}
        <div className="lg:col-span-2 space-y-4">
          <VideoControlsPanel file={file} croppedAreaPixels={croppedAreaPixels} onCropAndTrim={handleCropAndTrim} />

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
