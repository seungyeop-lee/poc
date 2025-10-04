import { useState } from 'react';

interface CropControlsProps {
  zoom: number;
  onZoomChange: (zoom: number) => void;
  aspect: number;
  onAspectChange: (aspect: number) => void;
}

function CropControls({ zoom, onZoomChange, aspect, onAspectChange }: CropControlsProps) {
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [aspectValue, setAspectValue] = useState(1.0);

  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(1, Math.min(3, value));
    onZoomChange(clamped);
  };

  const aspectRatios = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '16:9', value: 16 / 9 },
    { label: 'Free', value: 0 },
  ];

  const handleAspectValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setAspectValue(value);
    onAspectChange(value);
  };

  const handleAspectInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(0.5, Math.min(3.0, value));
    setAspectValue(clamped);
    onAspectChange(clamped);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Zoom:
          <input
            type="number"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={handleZoomInputChange}
            className="w-16 mx-2 px-2 py-1 border rounded"
          />
          x
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
              onClick={() => {
                if (ratio.label === 'Free') {
                  setIsFreeMode(true);
                  onAspectChange(aspectValue);
                } else {
                  setIsFreeMode(false);
                  onAspectChange(ratio.value);
                }
              }}
              className={`px-4 py-2 rounded ${
                ratio.label === 'Free'
                  ? isFreeMode
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : !isFreeMode && aspect === ratio.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {ratio.label}
            </button>
          ))}
        </div>

        {isFreeMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aspect Ratio:
              <input
                type="number"
                min={0.5}
                max={3.0}
                step={0.01}
                value={aspectValue}
                onChange={handleAspectInputChange}
                className="w-16 mx-2 px-2 py-1 border rounded"
              />
              :1
            </label>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.01}
              value={aspectValue}
              onChange={handleAspectValueChange}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CropControls;
