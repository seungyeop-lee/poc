interface ResizeScaleSliderProps {
  scale: number;
  onScaleChange: (scale: number) => void;
  cropAreaWidth: number;
  cropAreaHeight: number;
}

function ResizeScaleSlider({
  scale,
  onScaleChange,
  cropAreaWidth,
  cropAreaHeight,
}: ResizeScaleSliderProps) {
  const outputWidth = Math.round(cropAreaWidth * scale);
  const outputHeight = Math.round(cropAreaHeight * scale);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium text-gray-900 mb-2">리사이징</h3>

      <div className="space-y-2">
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
  );
}

export default ResizeScaleSlider;
