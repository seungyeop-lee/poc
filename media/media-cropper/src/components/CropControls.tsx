interface CropControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  aspect: number;
  onAspectChange: (aspect: number) => void;
}

function CropControls({ zoom, onZoomChange, aspect, onAspectChange }: CropControlsProps) {
  const aspectRatios = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: 'Free', value: 0 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zoom: {zoom.toFixed(1)}x
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => onZoomChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aspect Ratio
        </label>
        <div className="flex gap-2">
          {aspectRatios.map((ratio) => (
            <button
              key={ratio.label}
              onClick={() => onAspectChange(ratio.value)}
              className={`px-4 py-2 rounded ${
                aspect === ratio.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CropControls;
