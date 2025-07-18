'use client';

import { useRef, useState, useEffect } from 'react';

/**
 * 웹캠 영상 캡처를 위한 컴포넌트
 * 카메라와 마이크 권한 요청 및 스트림 관리 기능 제공
 */
interface WebcamCaptureProps {
  /** 웹캠 스트림이 준비되었을 때 호출되는 콜백 */
  onStreamReady: (stream: MediaStream) => void;
  /** 뒤로 가기 버튼 클릭 시 호출되는 콜백 */
  onBack: () => void;
  /** 비디오 품질 설정 */
  videoConstraints?: MediaTrackConstraints;
  /** 오디오 활성화 여부 */
  enableAudio?: boolean;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ 
  onStreamReady, 
  onBack,
  videoConstraints = { 
    width: { ideal: 1920, min: 640 }, 
    height: { ideal: 1080, min: 480 },
    facingMode: 'user'
  },
  enableAudio = true
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startWebcam = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let mediaStream: MediaStream;
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: enableAudio
        });
      } catch (firstError) {
        console.warn('고해상도 설정 실패, 기본 설정으로 재시도:', firstError);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: enableAudio
        });
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        await new Promise<void>((resolve, reject) => {
          const video = videoRef.current;
          if (!video) {
            reject(new Error('Video element not found'));
            return;
          }

          const timeoutId = setTimeout(() => {
            reject(new Error('Metadata load timeout'));
          }, 5000);

          const onLoadedMetadata = () => {
            clearTimeout(timeoutId);
            console.log('웹캠 비디오 메타데이터 로드됨:', {
              videoWidth: video.videoWidth,
              videoHeight: video.videoHeight,
              readyState: video.readyState
            });
            resolve();
          };

          video.onloadedmetadata = onLoadedMetadata;
          
          if (video.readyState >= 1) {
            clearTimeout(timeoutId);
            onLoadedMetadata();
          }
        });
        
        try {
          await videoRef.current.play();
          console.log('웹캠 재생 시작됨');
        } catch (playError) {
          console.warn('자동 재생 실패:', playError);
        }
      }
      
      setStream(mediaStream);
    } catch (err) {
      console.error('웹캠 접근 오류:', err);
      setError(`웹캠에 접근할 수 없습니다: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleConfirm = () => {
    if (stream) {
      onStreamReady(stream);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">웹캠 캡처</h2>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700"
        >
          ← 뒤로
        </button>
      </div>

      <div className="mb-4">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className={`w-full max-h-64 rounded-lg bg-black ${!stream ? 'hidden' : ''}`}
        />
      </div>

      {!stream ? (
        <div className="text-center">
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}
          
          <div className="text-6xl mb-4">📹</div>
          <p className="text-lg font-medium mb-4">웹캠을 시작하세요</p>
          <p className="text-gray-500 mb-6">
            카메라와 마이크에 대한 권한이 필요합니다
          </p>
          
          <button
            onClick={startWebcam}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? '웹캠 시작 중...' : '웹캠 시작'}
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            이 웹캠 사용
          </button>
          <button
            onClick={stopWebcam}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
          >
            웹캠 중지
          </button>
        </div>
      )}
    </div>
  );
};

export default WebcamCapture;