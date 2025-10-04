import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Cropper from 'react-easy-crop';
import CropControls from '../components/CropControls.tsx';
import TrimControls from '../components/TrimControls.tsx';
import UpscaleControls from '../components/UpscaleControls.tsx';
import FormatSelector from '../components/FormatSelector.tsx';
import { cropAndTrimVideo, checkWebCodecsSupport } from '../utils/cropVideo.ts';
import { downloadBlob } from '../utils/cropImage.ts';
import { checkVideoFormatSupport } from '../utils/checkFormatSupport.ts';

interface LocationState {
  file: File;
  fileUrl: string;
}

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

function VideoCropPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(16 / 9);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [croppedVideoUrl, setCroppedVideoUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [webCodecsSupported] = useState(checkWebCodecsSupport());
  const [outputWidth, setOutputWidth] = useState(1280);
  const [outputHeight, setOutputHeight] = useState(720);
  const [lockAspectRatio, setLockAspectRatio] = useState(false);
  const [outputFormat, setOutputFormat] = useState('video/webm');
  const [supportedFormats, setSupportedFormats] = useState<string[]>([]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration);
        setEndTime(video.duration);
      });
    }
  }, []);

  useEffect(() => {
    const formats = ['video/webm', 'video/mp4'];
    const supported = formats.filter(checkVideoFormatSupport);
    setSupportedFormats(supported);
  }, []);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
    setOutputWidth(Math.round(croppedAreaPixels.width));
    setOutputHeight(Math.round(croppedAreaPixels.height));
  }, []);

  const handleCropAndTrim = async () => {
    if (!state?.file || !croppedAreaPixels) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const blob = await cropAndTrimVideo(
        state.file,
        croppedAreaPixels,
        { start: startTime, end: endTime },
        outputWidth,
        outputHeight,
        outputFormat,
        (p) => setProgress(p)
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md bg-white p-8 rounded-lg shadow text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">지원되지 않는 브라우저</h2>
          <p className="text-gray-600 mb-4">
            비디오 크롭 기능은 Chrome 94+, Edge 94+, Firefox 133+에서만 사용 가능합니다.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">파일이 선택되지 않았습니다.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <video ref={videoRef} src={state.fileUrl} className="hidden" />

      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">비디오 크롭 및 트림</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            홈으로
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px', position: 'relative' }}>
              <Cropper
                video={state.fileUrl}
                crop={crop}
                zoom={zoom}
                aspect={aspect || undefined}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={true}
              />
            </div>
          </div>

          <div className="space-y-4">
            <CropControls
              zoom={zoom}
              onZoomChange={setZoom}
              aspect={aspect}
              onAspectChange={setAspect}
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

            <UpscaleControls
              outputWidth={outputWidth}
              outputHeight={outputHeight}
              onWidthChange={setOutputWidth}
              onHeightChange={setOutputHeight}
              lockAspectRatio={lockAspectRatio}
              onLockAspectRatioChange={setLockAspectRatio}
            />

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
              {isProcessing ? `처리 중... ${Math.round(progress * 100)}%` : '크롭 및 트림 실행'}
            </button>

            {croppedVideoUrl && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium text-gray-900 mb-2">미리보기</h3>
                <video src={croppedVideoUrl} controls className="w-full rounded" />
                <button
                  onClick={handleDownload}
                  className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  다운로드
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCropPage;
