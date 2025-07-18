'use client';

import { useState } from 'react';
import VideoUpload from '../components/media/VideoUpload';
import WebcamCapture from '../components/media/WebcamCapture';
import ImageUpload from '../components/media/ImageUpload';
import VideoEditor from '../features/VideoEditor';
import type { VideoSource } from '../types';

export default function Home() {
  const [videoSource, setVideoSource] = useState<VideoSource>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [webcamStream, setWebcamStream] = useState<MediaStream | null>(null);
  const [overlayImage, setOverlayImage] = useState<File | null>(null);

  const resetSources = () => {
    setVideoSource(null);
    setVideoFile(null);
    setWebcamStream(null);
    setOverlayImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            웹 기반 비디오 편집기
          </h1>
          <p className="text-gray-600">
            비디오나 웹캠 영상에 이미지를 오버레이하여 새로운 비디오를 만들어보세요
          </p>
        </header>

        {!videoSource && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">영상 소스 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setVideoSource('upload')}
                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📁</div>
                  <h3 className="text-lg font-medium">비디오 파일 업로드</h3>
                  <p className="text-gray-500">MP4, WebM, MOV 파일 지원</p>
                </div>
              </button>
              <button
                onClick={() => setVideoSource('webcam')}
                className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <div className="text-4xl mb-2">📹</div>
                  <h3 className="text-lg font-medium">웹캠 사용</h3>
                  <p className="text-gray-500">실시간 웹캠 녹화</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {videoSource === 'upload' && (
          <VideoUpload
            onVideoSelect={setVideoFile}
            onBack={resetSources}
          />
        )}

        {videoSource === 'webcam' && (
          <WebcamCapture
            onStreamReady={setWebcamStream}
            onBack={resetSources}
          />
        )}

        {(videoFile || webcamStream) && (
          <>
            <ImageUpload
              onImageSelect={setOverlayImage}
            />
            
            {overlayImage && (
              <VideoEditor
                videoFile={videoFile}
                webcamStream={webcamStream}
                overlayImage={overlayImage}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
