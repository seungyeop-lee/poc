import { useState } from 'react';

interface CropResizePanelProps {
  // 크롭 관련
  zoom: number;
  onZoomChange: (zoom: number) => void;
  aspect: number;
  onAspectChange: (aspect: number) => void;

  // 리사이징 관련
  scale: number;
  onScaleChange: (scale: number) => void;
  cropAreaWidth: number;
  cropAreaHeight: number;
}

function CropResizePanel({
  zoom,
  onZoomChange,
  aspect,
  onAspectChange,
  scale,
  onScaleChange,
  cropAreaWidth,
  cropAreaHeight,
}: CropResizePanelProps) {
  const [isFreeMode, setIsFreeMode] = useState(false);
  const [aspectValue, setAspectValue] = useState(1.0);

  // 결과 크기 계산
  const outputWidth = Math.round(cropAreaWidth * scale);
  const outputHeight = Math.round(cropAreaHeight * scale);

  // Zoom 핸들러
  const handleZoomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(1, Math.min(3, value));
    onZoomChange(clamped);
  };

  // Aspect Ratio 관련
  const aspectRatios = [
    { label: '1:1', value: 1 },
    { label: '4:3', value: 4 / 3 },
    { label: '3:4', value: 3 / 4 },
    { label: '16:9', value: 16 / 9 },
    { label: '9:16', value: 9 / 16 },
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
    const clamped = Math.max(0.33, Math.min(3.0, value));
    setAspectValue(clamped);
    onAspectChange(clamped);
  };

  const handleAspectButtonClick = (ratio: { label: string; value: number }) => {
    if (ratio.label === 'Free') {
      setIsFreeMode(true);
      onAspectChange(aspectValue);
    } else {
      setIsFreeMode(false);
      onAspectChange(ratio.value);
    }
  };

  return (
    <div data-testid="crop-resize-panel" className="bg-white p-4 rounded-lg shadow space-y-6 w-full">
      <h3 className="font-medium text-gray-900">크롭 및 리사이징</h3>

      {/* 크롭 설정 섹션 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900 border-b pb-2">크롭 설정</h4>

        {/* Zoom 컨트롤 */}
        <div data-testid="zoom-slider">
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

        {/* Aspect Ratio 컨트롤 */}
        <div data-testid="aspect-ratio-select">
          <label className="block text-sm font-medium text-gray-700 mb-2">종횡비</label>
          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.label}
                onClick={() => handleAspectButtonClick(ratio)}
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
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                종횡비:
                <input
                  type="number"
                  min={0.33}
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
                min={0.33}
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

      {/* 리사이징 섹션 */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900 border-b pb-2">리사이징</h4>

        {/* Scale 컨트롤 */}
        <div data-testid="scale-slider" className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">배율</span>
            <span className="text-sm font-medium text-gray-900">{scale.toFixed(1)}x</span>
          </div>

          <input
            type="range"
            min={0.5}
            max={3.0}
            step={0.1}
            value={scale}
            onChange={(e) => onScaleChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">결과 크기</span>
            <span className="text-sm font-medium text-gray-900">
              {outputWidth} × {outputHeight} px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropResizePanel;
