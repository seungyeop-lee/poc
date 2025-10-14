import React, { useCallback, useEffect, useRef } from 'react';
import Cropper from 'react-easy-crop';
import { formatTime } from '../../utils/videoMetadata';

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

interface VideoPlayerSectionProps {
  fileUrl: string | null;
  crop: Point;
  zoom: number;
  aspect: number | null;
  onCropChange: (crop: Point) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedAreaPixels: Area, _: Area) => void;
  duration: number;
  liveCurrentTime: number;
  startTime: number;
  endTime: number;
  onDurationChange: (duration: number) => void;
  onEndTimeChange: (endTime: number) => void;
  onLiveCurrentTimeChange: (currentTime: number) => void;
}

export default function VideoPlayerSection({
  fileUrl,
  crop,
  zoom,
  aspect,
  onCropChange,
  onZoomChange,
  onCropComplete,
  duration,
  liveCurrentTime,
  startTime,
  endTime,
  onDurationChange,
  onEndTimeChange,
  onLiveCurrentTimeChange,
}: VideoPlayerSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.addEventListener('loadedmetadata', () => {
        onDurationChange(video.duration);
        onEndTimeChange(video.duration);
      });
    }
  }, [onDurationChange, onEndTimeChange]);

  const handleVideoTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement>) => {
      const video = e.currentTarget;
      onLiveCurrentTimeChange(video.currentTime);

      // 트림 구간 반복 재생: endTime을 초과하면 startTime으로 되돌림
      if (endTime > 0 && video.currentTime >= endTime) {
        video.currentTime = startTime;
      }
    },
    [startTime, endTime, onLiveCurrentTimeChange],
  );

  return (
    <div className="space-y-4">
      {/* 숨겨진 video 요소 */}
      <video ref={videoRef} src={fileUrl || ''} className="hidden" />

      {/* 비디오 크롭 영역 */}
      <div className="bg-white rounded-lg shadow overflow-hidden" style={{ height: '500px', position: 'relative' }}>
        {fileUrl ? (
          <Cropper
            video={fileUrl}
            crop={crop}
            zoom={zoom}
            aspect={aspect || undefined}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            restrictPosition={true}
            mediaProps={{
              onTimeUpdate: handleVideoTimeUpdate,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">비디오 파일을 선택해주세요</p>
          </div>
        )}
      </div>

      {/* 재생 시간 표시 */}
      {duration > 0 && (
        <div className="text-sm text-gray-600 text-center bg-white p-2 rounded shadow">
          재생 시간: {formatTime(liveCurrentTime)} / {formatTime(duration)}
        </div>
      )}
    </div>
  );
}
