import { useEffect, useState } from 'react';
import { type CodecSpecificOptions, getOptimalCodecOptions, type VideoMetadata } from '../../../utils/videoMetadata.ts';

interface AdvancedVideoProcessorProps {
  metadata: VideoMetadata | null;
  selectedCodec?: string;
  onOptionsChange?: (options: CodecSpecificOptions) => void;
}

export default function AdvancedVideoProcessor({
  metadata,
  selectedCodec = 'avc',
  onOptionsChange,
}: AdvancedVideoProcessorProps) {
  const [options, setOptions] = useState<CodecSpecificOptions | null>(null);
  const [autoOptimize, setAutoOptimize] = useState(false); // 기본값 변경: 사용자가 직접 설정할 수 있도록
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (metadata) {
      loadOptimalOptions();
    }
  }, [metadata, selectedCodec]);

  const loadOptimalOptions = async () => {
    if (!metadata) return;

    setLoading(true);
    try {
      const optimalOptions = getOptimalCodecOptions(metadata, selectedCodec, 'high');

      // 키프레임 간격이 30을 초과하는 경우 제한 (요구사항)
      if (optimalOptions.keyFrameInterval && optimalOptions.keyFrameInterval > 30) {
        optimalOptions.keyFrameInterval = 30;
      }

      setOptions(optimalOptions);

      if (onOptionsChange) {
        onOptionsChange(optimalOptions);
      }
    } catch (error) {
      console.error('최적 옵션 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBitrateChange = (bitrate: number) => {
    if (!options) return;

    const newOptions = { ...options, bitrate };
    setOptions(newOptions);

    if (onOptionsChange) {
      onOptionsChange(newOptions);
    }
  };

  const handleFrameRateChange = (frameRate: number) => {
    if (!options) return;

    // 유효성 검사: 1-120 fps 범위
    if (frameRate < 1 || frameRate > 120 || isNaN(frameRate)) {
      console.warn('유효하지 않은 프레임률:', frameRate);
      return;
    }

    const newOptions = { ...options, frameRate };
    setOptions(newOptions);

    if (onOptionsChange) {
      onOptionsChange(newOptions);
    }
  };

  const handleKeyFrameIntervalChange = (interval: number) => {
    if (!options) return;

    // 유효성 검사: 1-30 프레임 범위 (요구사항에 따라 제한)
    if (interval < 1 || interval > 30 || isNaN(interval)) {
      console.warn('유효하지 않은 키프레임 간격:', interval);
      return;
    }

    const newOptions = { ...options, keyFrameInterval: interval };
    setOptions(newOptions);

    if (onOptionsChange) {
      onOptionsChange(newOptions);
    }
  };

  if (!metadata) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">고급 출력 옵션</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
          <p className="text-yellow-600 text-sm">비디오 정보를 먼저 불러와주세요.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">고급 출력 옵션</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">최적 설정 계산 중...</span>
        </div>
      </div>
    );
  }

  if (!options) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-3">고급 출력 옵션</h3>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 text-sm">출력 옵션을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">고급 출력 옵션</h3>
        <div className="flex items-center space-x-2">
          <label className="flex items-center text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoOptimize}
              onChange={(e) => setAutoOptimize(e.target.checked)}
              className="mr-1"
            />
            자동 최적화
          </label>
        </div>
      </div>

      {/* 코덱 정보 */}
      <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">선택된 코덱</span>
          <span className="text-sm font-mono text-gray-900">{options.codec}</span>
        </div>
      </div>

      {/* 자동 최적화 정보 패널 */}
      {autoOptimize && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-sm text-blue-900">
            <strong>자동 최적화 활성화:</strong> 비트레이트 {Math.round(options.bitrate! / 1000)} kbps, 프레임률{' '}
            {options.frameRate} fps, 키프레임 간격 {options.keyFrameInterval} 프레임
          </p>
        </div>
      )}

      {/* 비트레이트 설정 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          비트레이트: {Math.round(options.bitrate! / 1000)} kbps
        </label>
        <input
          type="range"
          min="500000"
          max="20000000"
          step="100000"
          value={options.bitrate}
          onChange={(e) => handleBitrateChange(Number(e.target.value))}
          disabled={autoOptimize}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5 Mbps</span>
          <span>20 Mbps</span>
        </div>
      </div>

      {/* 프레임레이트 설정 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">프레임률 (fps)</label>
        <select
          value={options.frameRate}
          onChange={(e) => handleFrameRateChange(Number(e.target.value))}
          disabled={autoOptimize}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
        >
          {[24, 25, 30, 50, 60]
            .filter((fps) => fps <= metadata.frameRate)
            .map((fps) => (
              <option key={fps} value={fps}>
                {fps} fps
              </option>
            ))}
        </select>
        <div className="mt-1 text-xs text-gray-500">원본: {metadata.frameRate} fps</div>
      </div>

      {/* 키프레임 간격 설정 */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          키프레임 간격: {options.keyFrameInterval} 프레임
        </label>
        <input
          type="range"
          min="1"
          max="30"
          step="1"
          value={options.keyFrameInterval}
          onChange={(e) => handleKeyFrameIntervalChange(Number(e.target.value))}
          disabled={autoOptimize}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1 (최고 품질)</span>
          <span>30 (작은 파일)</span>
        </div>
        <div className="mt-1 text-xs text-blue-600">
          {options.frameRate && options.keyFrameInterval
            ? `약 ${(options.keyFrameInterval / options.frameRate).toFixed(1)}초 간격`
            : '프레임률 설정 필요'}
        </div>
      </div>

      {/* 설정 정보 */}
      <div className="p-3 bg-green-50 border border-green-200 rounded">
        <p className="text-xs text-green-800">
          <strong>추천 설정:</strong> {options.codec} 코덱에 최적화된 설정입니다. 예상 파일 크기는 원본의 약{' '}
          {Math.round((options.bitrate! / metadata.bitrate) * 100)}% 수준입니다.
        </p>
      </div>
    </div>
  );
}
