import { useEffect, useState } from 'react';
import { type CodecInfo, getSupportedCodecs, getSupportedCodecsForFormat } from '../../utils/codecSupport';

const FORMAT_LABELS: Record<string, string> = {
  'video/webm': 'WebM',
  'video/mp4': 'MP4',
};

const VIDEO_FORMATS = ['video/webm', 'video/mp4'];

interface OutputSettingsPanelProps {
  outputFormat: string;
  selectedCodec: string;
  supportedFormats: string[];
  onFormatChange: (format: string) => void;
  onCodecChange: (codec: string) => void;
  disabled?: boolean;
}

export default function OutputSettingsPanel({
  outputFormat,
  selectedCodec,
  supportedFormats,
  onFormatChange,
  onCodecChange,
  disabled = false,
}: OutputSettingsPanelProps) {
  const [videoCodecs, setVideoCodecs] = useState<CodecInfo[]>([]);
  const [filteredCodecs, setFilteredCodecs] = useState<CodecInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 모든 지원 코덱 로드
  useEffect(() => {
    loadSupportedCodecs();
  }, []);

  // 포맷 변경 시 호환 코덱 필터링 및 자동 선택
  useEffect(() => {
    if (outputFormat && videoCodecs.length > 0) {
      filterAndSelectCodec();
    }
  }, [outputFormat, videoCodecs]);

  const loadSupportedCodecs = async () => {
    try {
      setLoading(true);
      setError(null);

      const codecInfos = await getSupportedCodecs();
      const supportedVideoCodecs = codecInfos.filter((codec) => codec.type === 'video');

      setVideoCodecs(supportedVideoCodecs);
    } catch (err) {
      setError('코덱 정보를 불러오는 중 오류가 발생했습니다.');
      console.error('OutputSettingsPanel 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSelectCodec = async () => {
    try {
      // 해당 포맷에 맞는 코덱 목록 가져오기
      const supportedCodecs = await getSupportedCodecsForFormat(outputFormat);

      // 전체 코덱 목록에서 호환되는 코덱만 필터링
      const compatibleCodecs = videoCodecs.filter((codec) => supportedCodecs.video.includes(codec.name));

      setFilteredCodecs(compatibleCodecs);

      // 현재 선택된 코덱이 호환되지 않거나 선택된 코덱이 없으면 첫 번째 호환 코덱 자동 선택
      if (!selectedCodec || !compatibleCodecs.some((codec) => codec.name === selectedCodec)) {
        if (compatibleCodecs.length > 0) {
          const firstCompatibleCodec = compatibleCodecs[0].name;
          onCodecChange(firstCompatibleCodec);
          console.log(`🎯 포맷 ${outputFormat}에 맞는 코덱 자동 선택: ${firstCompatibleCodec}`);
        }
      }
    } catch (error) {
      console.error('❌ 코덱 필터링 실패:', error);
      // 에러 시 기본 코덱으로 설정
      const fallbackCodecs: Record<string, string> = {
        'video/mp4': 'avc1',
        'video/webm': 'vp8',
      };
      const fallbackCodec = fallbackCodecs[outputFormat] || 'vp8';
      onCodecChange(fallbackCodec);
    }
  };

  const handleFormatChange = (format: string) => {
    onFormatChange(format);
  };

  const handleCodecChange = (codec: string) => {
    onCodecChange(codec);
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-3">출력 설정</h3>
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">코덱 확인 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="font-medium text-gray-900 mb-3">출력 설정</h3>
        <div className="bg-red-50 border border-red-200 rounded p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="output-settings-panel" className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium text-gray-900 mb-4">출력 설정</h3>

      <div className="space-y-4">
        {/* 포맷 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">출력 포맷</label>
          <select
            value={outputFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
            disabled={disabled}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {VIDEO_FORMATS.map((format) => (
              <option key={format} value={format} disabled={!supportedFormats.includes(format)}>
                {FORMAT_LABELS[format] || format}
                {!supportedFormats.includes(format) && ' (미지원)'}
              </option>
            ))}
          </select>
        </div>

        {/* 코덱 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">비디오 코덱</label>

          {filteredCodecs.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-yellow-800 text-sm">이 포맷에 지원되는 코덱이 없습니다. 다른 포맷을 선택해주세요.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredCodecs.map((codec) => (
                <label
                  key={codec.name}
                  className={`
                    flex items-start p-3 border rounded-lg cursor-pointer transition-colors
                    ${
                      selectedCodec === codec.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <input
                    type="radio"
                    name="codec"
                    value={codec.name}
                    checked={selectedCodec === codec.name}
                    onChange={() => handleCodecChange(codec.name)}
                    disabled={disabled}
                    className="mt-1 mr-3"
                  />
                  <div className="flex-1">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900">{codec.name}</span>
                      {selectedCodec === codec.name && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded">선택됨</span>
                      )}
                    </div>
                    {codec.description && <p className="text-sm text-gray-600 mt-1">{codec.description}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 호환성 정보 */}
        {selectedCodec && filteredCodecs.some((codec) => codec.name === selectedCodec) && (
          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
            <p className="text-sm text-green-800">
              ✅{' '}
              <span className="font-medium">
                {FORMAT_LABELS[outputFormat]} + {selectedCodec}
              </span>{' '}
              조합은 호환됩니다.
            </p>
          </div>
        )}

        {selectedCodec && !filteredCodecs.some((codec) => codec.name === selectedCodec) && (
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-yellow-800">
              ⚠️ <span className="font-medium">{selectedCodec}</span> 코덱은 현재 포맷과 호환되지 않을 수 있습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
