interface FormatSelectorProps {
  mediaType: 'image' | 'video';
  selectedFormat: string;
  onFormatChange: (format: string) => void;
  supportedFormats: string[];
}

const FORMAT_LABELS: Record<string, string> = {
  'image/jpeg': 'JPEG',
  'image/png': 'PNG',
  'image/webp': 'WebP',
  'video/webm': 'WebM',
  'video/mp4': 'MP4',
};

const IMAGE_FORMATS = ['image/jpeg', 'image/png', 'image/webp'];
const VIDEO_FORMATS = ['video/webm', 'video/mp4'];

function FormatSelector({
  mediaType,
  selectedFormat,
  onFormatChange,
  supportedFormats,
}: FormatSelectorProps) {
  const formats = mediaType === 'image' ? IMAGE_FORMATS : VIDEO_FORMATS;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        출력 포맷
      </label>
      <select
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      >
        {formats.map((format) => (
          <option
            key={format}
            value={format}
            disabled={!supportedFormats.includes(format)}
          >
            {FORMAT_LABELS[format] || format}
            {!supportedFormats.includes(format) && ' (미지원)'}
          </option>
        ))}
      </select>
    </div>
  );
}

export default FormatSelector;
