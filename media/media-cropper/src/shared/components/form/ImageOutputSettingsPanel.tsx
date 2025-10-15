const FORMAT_LABELS: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
};

interface ImageOutputSettingsPanelProps {
  outputFormat: string;
  supportedFormats: string[];
  onFormatChange: (format: string) => void;
  disabled?: boolean;
}

export default function ImageOutputSettingsPanel({
  outputFormat,
  supportedFormats,
  onFormatChange,
  disabled = false,
}: ImageOutputSettingsPanelProps) {
  const handleFormatChange = (format: string) => {
    onFormatChange(format);
  };

  return (
    <div data-testid="image-output-settings-panel" className="bg-white p-4 rounded-lg shadow w-full">
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
            {Object.keys(FORMAT_LABELS).map((format) => (
              <option key={format} value={format} disabled={!supportedFormats.includes(format)}>
                {FORMAT_LABELS[format] || format}
                {!supportedFormats.includes(format) && ' (미지원)'}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
