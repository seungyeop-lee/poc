import { useState, useEffect } from 'react';
import {
  extractVideoMetadata,
  formatDuration,
  formatFileSize,
  getResolutionName,
  formatBitrate,
  type VideoMetadata
} from '../../utils/videoMetadata';
import Tooltip from '../ui/Tooltip';

interface VideoMetadataDisplayProps {
  file: File;
}

export default function VideoMetadataDisplay({ file }: VideoMetadataDisplayProps) {
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetadata();
  }, [file]);

  const loadMetadata = async () => {
    try {
      setLoading(true);
      setError(null);
      const videoMetadata = await extractVideoMetadata(file);
      setMetadata(videoMetadata);
    } catch (err) {
      setError('비디오 메타데이터를 불러오는 중 오류가 발생했습니다.');
      console.error('VideoMetadataDisplay 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">비디오 정보</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">비디오 정보 분석 중...</span>
        </div>
        <div className="text-center text-xs text-gray-500 mt-2">
          정확한 프레임률 계산을 위해 메타데이터를 추출하고 있습니다
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">비디오 정보</h3>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 text-sm">{error}</p>
          <p className="text-red-500 text-xs mt-1">
            프레임률 정보를 정확하게 표시할 수 없습니다.
          </p>
          <button
            onClick={loadMetadata}
            className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  if (!metadata) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">비디오 정보</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-yellow-600 text-sm">비디오 정보를 가져올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">비디오 정보</h3>
          <Tooltip
            content="이 정보는 현재 비디오 파일의 메타데이터를 기반으로 합니다. 출력되는 파일의 코덱과 품질 설정에 따라 최종 결과가 달라질 수 있습니다."
            position="top"
            delay={300}
          >
            <span
              className="text-blue-500 cursor-help hover:text-blue-700 transition-colors"
              role="button"
              tabIndex={0}
              aria-label="정보"
            >
              ℹ️
            </span>
          </Tooltip>
        </div>
        <button
          onClick={loadMetadata}
          className="text-blue-500 hover:text-blue-700 text-sm"
          title="새로고침"
        >
          ↻
        </button>
      </div>

      <div className="space-y-3">
        {/* 해상도 정보 */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">해상도</span>
          <span className="text-sm text-gray-900">
            {metadata.width}×{metadata.height} ({getResolutionName(metadata.width, metadata.height)})
          </span>
        </div>

        {/* 프레임률 */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">프레임률</span>
          <span className="text-sm text-gray-900">{metadata.frameRate.toFixed(1)} fps</span>
        </div>

        {/* 비트레이트 */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">비트레이트</span>
          <span className="text-sm text-gray-900">{formatBitrate(metadata.bitrate)}</span>
        </div>

        {/* 코덱 */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">코덱</span>
          <span className="text-sm font-mono text-gray-900">{metadata.codec}</span>
        </div>

        {/* 파일 크기 */}
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-600">파일 크기</span>
          <span className="text-sm text-gray-900">{formatFileSize(metadata.fileSize)}</span>
        </div>

        {/* 재생 시간 */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-medium text-gray-600">재생 시간</span>
          <span className="text-sm text-gray-900">{formatDuration(metadata.duration)}</span>
        </div>
      </div>

      </div>
  );
}