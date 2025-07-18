'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import type { VideoEditorProps, DebugInfo, AudioSettings, RecordingState } from '../types';
import { formatTime, calculateOverlayPosition, cleanupObjectUrl } from '../utils';

/**
 * 비디오 편집 기능을 제공하는 메인 컴포넌트
 * 비디오/웹캠 스트림에 이미지 오버레이를 적용하고 녹화 기능 제공
 */
export const VideoEditor: React.FC<VideoEditorProps> = ({ 
  videoFile, 
  webcamStream, 
  overlayImage,
  onVideoProcessed,
  watermarkPosition = 'top-right'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);
  const audioSourcesRef = useRef<Set<MediaElementAudioSourceNode>>(new Set());
  const gainNodeRef = useRef<GainNode | null>(null);
  
  const [overlayImageElement, setOverlayImageElement] = useState<HTMLImageElement | null>(null);
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    recordingTime: 0,
    recordedChunks: [],
    downloadUrl: null
  });
  const [audioSettings, setAudioSettings] = useState<AudioSettings>({
    enabled: false,
    detectedElements: 0,
    gainLevel: 1.0
  });
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    canvasWidth: 0,
    canvasHeight: 0,
    videoWidth: 0,
    videoHeight: 0,
    readyState: 0,
    sourceType: '없음'
  });

  // 오버레이 이미지 로드
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setOverlayImageElement(img);
    };
    img.src = URL.createObjectURL(overlayImage);
    
    return () => {
      cleanupObjectUrl(img.src);
    };
  }, [overlayImage]);

  // 비디오 소스 설정
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoFile) {
      video.src = URL.createObjectURL(videoFile);
      video.load();
    } else if (webcamStream) {
      video.srcObject = webcamStream;
      video.muted = true;
      video.playsInline = true;
      video.play().catch(err => console.warn('웹캠 재생 실패:', err));
      
      const checkAndStart = () => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          console.log('웹캠 비디오 준비됨, 애니메이션 시작');
        }
      };
      
      setTimeout(checkAndStart, 100);
    }

    return () => {
      if (videoFile && video.src) {
        cleanupObjectUrl(video.src);
      }
    };
  }, [videoFile, webcamStream]);

  // 캔버스에 프레임 그리기
  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (!canvas || !video || !ctx) return;

    if (webcamStream) {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        if (canvas.width === 0 && canvas.height === 0) {
          canvas.width = 1920;
          canvas.height = 1080;
        }
        return;
      }
    } else {
      if (video.readyState < 2) return;
    }

    const videoWidth = video.videoWidth || 1920;
    const videoHeight = video.videoHeight || 1080;
    
    if (canvas.width !== videoWidth || canvas.height !== videoHeight) {
      canvas.width = videoWidth;
      canvas.height = videoHeight;
      console.log('캔버스 크기 설정:', { width: videoWidth, height: videoHeight });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    try {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      if (overlayImageElement) {
        const overlaySize = Math.min(canvas.width, canvas.height) * 0.15;
        const margin = overlaySize * 0.2;
        const position = calculateOverlayPosition(canvas.width, canvas.height, overlaySize, watermarkPosition, margin);
        
        ctx.drawImage(overlayImageElement, position.x, position.y, overlaySize, overlaySize);
      }
      
      setDebugInfo({
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        sourceType: videoFile ? '파일' : webcamStream ? '웹캠' : '없음'
      });
    } catch (error) {
      console.warn('프레임 그리기 오류:', error);
    }
  }, [overlayImageElement, webcamStream, videoFile, watermarkPosition]);

  // 비디오 메타데이터 로드 및 애니메이션 시작
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrameId: number;
    
    const handleLoadedMetadata = () => {
      console.log('비디오 메타데이터 로드됨:', {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
        readyState: video.readyState,
        srcObject: !!video.srcObject,
        src: !!video.src
      });
      
      if (webcamStream) {
        video.play().catch(err => console.warn('웹캠 재생 실패:', err));
      }
      
      const startAnimation = () => {
        drawFrame();
        animationFrameId = requestAnimationFrame(startAnimation);
      };
      startAnimation();
    };

    const handleCanPlay = () => {
      console.log('비디오 재생 가능 상태');
      if (!animationFrameId) {
        handleLoadedMetadata();
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    
    if (webcamStream && video.srcObject) {
      const timer = setTimeout(() => {
        if (video.videoWidth > 0 && video.videoHeight > 0) {
          handleLoadedMetadata();
        }
      }, 100);
      
      return () => {
        clearTimeout(timer);
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('canplay', handleCanPlay);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
    
    if (video.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [drawFrame, webcamStream]);

  // DOM 변화 감지 및 새 오디오 요소 자동 연결
  useEffect(() => {
    if (!audioSettings.enabled) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            if (element.tagName === 'AUDIO' || element.tagName === 'VIDEO') {
              connectNewAudioElement(element as HTMLMediaElement);
            }
            
            const audioVideoElements = element.querySelectorAll('audio, video');
            audioVideoElements.forEach((mediaElement) => {
              connectNewAudioElement(mediaElement as HTMLMediaElement);
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
    };
  }, [audioSettings.enabled]);

  // 웹페이지 내 모든 오디오 캡처 활성화
  const enablePageAudio = async () => {
    try {
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;

      const destination = audioContext.createMediaStreamDestination();
      
      gainNode.connect(destination);
      gainNode.connect(audioContext.destination);
      
      const audioVideoElements = document.querySelectorAll('audio, video');
      let connectedCount = 0;

      audioVideoElements.forEach((element) => {
        try {
          const mediaElement = element as HTMLMediaElement;
          
          if (mediaElement.hasAttribute('data-audio-connected')) {
            return;
          }

          const source = audioContext.createMediaElementSource(mediaElement);
          audioSourcesRef.current.add(source);
          
          source.connect(gainNode);
          
          mediaElement.setAttribute('data-audio-connected', 'true');
          connectedCount++;
          
          console.log('오디오 요소 연결됨:', mediaElement.tagName, mediaElement.src || mediaElement.currentSrc);
        } catch (error) {
          console.warn('오디오 요소 연결 실패:', element, error);
        }
      });
      
      audioStreamRef.current = destination.stream;
      setAudioSettings({
        enabled: true,
        detectedElements: connectedCount,
        gainLevel: 1.0
      });
      
      console.log(`페이지 오디오 캡처 활성화됨: ${connectedCount}개 요소 연결`);
    } catch (error) {
      console.error('페이지 오디오 캡처 실패:', error);
      setAudioSettings(prev => ({ ...prev, enabled: false }));
    }
  };

  // 새로 추가된 오디오/비디오 요소 자동 연결
  const connectNewAudioElement = (element: HTMLMediaElement) => {
    const audioContext = audioContextRef.current;
    const gainNode = gainNodeRef.current;
    
    if (!audioContext || !gainNode || element.hasAttribute('data-audio-connected')) {
      return;
    }

    try {
      const source = audioContext.createMediaElementSource(element);
      audioSourcesRef.current.add(source);
      source.connect(gainNode);
      element.setAttribute('data-audio-connected', 'true');
      
      setAudioSettings(prev => ({ ...prev, detectedElements: prev.detectedElements + 1 }));
      console.log('새 오디오 요소 자동 연결됨:', element.tagName);
    } catch (error) {
      console.warn('새 오디오 요소 연결 실패:', error);
    }
  };

  // 녹화 시작
  const startRecording = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(30);
      
      if (audioStreamRef.current) {
        const audioTracks = audioStreamRef.current.getAudioTracks();
        audioTracks.forEach(track => {
          stream.addTrack(track);
        });
        console.log('비디오 오디오 트랙 추가됨:', audioTracks.length);
      } else if (webcamStream) {
        const audioTracks = webcamStream.getAudioTracks();
        audioTracks.forEach(track => {
          stream.addTrack(track);
        });
        console.log('웹캠 오디오 트랙 추가됨:', audioTracks.length);
      } else {
        console.warn('오디오가 활성화되지 않음');
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      });

      mediaRecorderRef.current = mediaRecorder;
      setRecordingState({
        isRecording: true,
        recordingTime: 0,
        recordedChunks: [],
        downloadUrl: null
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordingState(prev => ({
            ...prev,
            recordedChunks: [...prev.recordedChunks, event.data]
          }));
        }
      };

      mediaRecorder.onstop = () => {
        setRecordingState(prev => ({ ...prev, isRecording: false }));
      };

      mediaRecorder.start(1000);

      const timer = setInterval(() => {
        setRecordingState(prev => ({ ...prev, recordingTime: prev.recordingTime + 1 }));
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    } catch (error) {
      console.error('녹화 시작 오류:', error);
    }
  };

  // 녹화 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState.isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  // 다운로드 URL 생성
  useEffect(() => {
    if (recordingState.recordedChunks.length > 0 && !recordingState.isRecording) {
      const blob = new Blob(recordingState.recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordingState(prev => ({ ...prev, downloadUrl: url }));
      
      if (onVideoProcessed) {
        onVideoProcessed(blob);
      }
      
      return () => {
        cleanupObjectUrl(url);
      };
    }
  }, [recordingState.recordedChunks, recordingState.isRecording, onVideoProcessed]);

  // 비디오 재생/일시정지 토글
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video || webcamStream) return;

    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">비디오 편집기</h2>
      
      {/* 디버깅용 비디오 미리보기 */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium mb-2">원본 영상 (디버깅용)</h3>
        <video
          ref={videoRef}
          className="w-64 h-auto border rounded"
          playsInline
          controls={!!videoFile}
        />
      </div>
      
      {/* 캔버스 미리보기 */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">편집된 영상</h3>
        <canvas
          ref={canvasRef}
          className="w-full max-h-96 bg-black rounded-lg border"
          style={{ aspectRatio: '16/9' }}
        />
        
        {/* 상태 정보 */}
        <div className="mt-2 text-xs text-gray-500 space-y-1">
          <div>캔버스 크기: {debugInfo.canvasWidth} × {debugInfo.canvasHeight}</div>
          <div>비디오 크기: {debugInfo.videoWidth} × {debugInfo.videoHeight}</div>
          <div>비디오 상태: {debugInfo.readyState} (2=로드됨, 4=재생가능)</div>
          <div>소스 타입: {debugInfo.sourceType}</div>
          {overlayImageElement && (
            <div>오버레이: {overlayImageElement.width} × {overlayImageElement.height}</div>
          )}
        </div>
      </div>

      {/* 컨트롤 패널 */}
      <div className="space-y-4">
        {/* 재생 컨트롤 */}
        {videoFile && (
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlayback}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              ⏯️ 재생/일시정지
            </button>
          </div>
        )}

        {/* 페이지 오디오 설정 */}
        <div className="flex items-center gap-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">페이지 오디오 캡처:</span>
            <div className={`w-3 h-3 rounded-full ${audioSettings.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className="text-sm">{audioSettings.enabled ? `활성화됨 (${audioSettings.detectedElements}개 요소)` : '비활성화됨'}</span>
          </div>
          {!audioSettings.enabled && (
            <button
              onClick={enablePageAudio}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
            >
              🔊 페이지 오디오 활성화
            </button>
          )}
          <div className="text-xs text-gray-600">
            웹페이지 내 모든 오디오/비디오 요소의 소리를 녹화에 포함합니다
          </div>
        </div>

        {/* 녹화 컨트롤 */}
        <div className="flex items-center gap-4">
          {!recordingState.isRecording ? (
            <button
              onClick={startRecording}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              🔴 녹화 시작
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              ⏹️ 녹화 중지
            </button>
          )}
          
          {recordingState.isRecording && (
            <div className="flex items-center gap-2 text-red-500">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span>녹화 중: {formatTime(recordingState.recordingTime)}</span>
            </div>
          )}
        </div>

        {/* 다운로드 */}
        {recordingState.downloadUrl && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-700 mb-2">✅ 녹화 완료!</p>
            <a
              href={recordingState.downloadUrl}
              download="edited_video.webm"
              className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              📥 비디오 다운로드
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEditor;