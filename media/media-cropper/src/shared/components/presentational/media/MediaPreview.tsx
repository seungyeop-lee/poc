import React, { useState, useRef } from 'react';

interface MediaPreviewProps {
  mediaType: 'image' | 'video';
  src: string;
  filename?: string;
  showTitle?: boolean;
  title?: string;
  onDownload?: () => void;
  className?: string;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaType,
  src,
  filename,
  showTitle = true,
  title,
  onDownload,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 비디오 전용 시간 포맷팅 함수
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const centisecs = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${centisecs.toString().padStart(2, '0')}`;
  };

  // 비디오 이벤트 핸들러
  const handleVideoTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (mediaType === 'video') {
      const video = e.currentTarget;
      setCurrentTime(video.currentTime);
    }
  };

  const handleVideoLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    if (mediaType === 'video') {
      const video = e.currentTarget;
      setDuration(video.duration);
    }
  };

  const displayTitle = title || (showTitle ? '미리보기' : '');

  return (
    <div className={`bg-white p-4 rounded-lg shadow ${className}`}>
      {displayTitle && (
        <h3 className="font-medium text-gray-900 mb-2">{displayTitle}</h3>
      )}

      {mediaType === 'image' ? (
        <img src={src} alt={filename || 'Preview'} className="w-full rounded" />
      ) : (
        <>
          <video
            ref={videoRef}
            src={src}
            controls
            loop
            className="w-full rounded"
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoadedMetadata}
          />
          {duration > 0 && (
            <div className="mt-2 text-sm text-gray-600 text-center">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          )}
        </>
      )}

      {onDownload && (
        <button
          onClick={onDownload}
          className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          다운로드
        </button>
      )}
    </div>
  );
};

export default MediaPreview;