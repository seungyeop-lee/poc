interface UpscaleControlsProps {
  outputWidth: number;
  outputHeight: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
  lockAspectRatio: boolean;
  onLockAspectRatioChange: (locked: boolean) => void;
}

function UpscaleControls({
  outputWidth,
  outputHeight,
  onWidthChange,
  onHeightChange,
  lockAspectRatio,
  onLockAspectRatioChange,
}: UpscaleControlsProps) {
  const aspectRatio = outputWidth / outputHeight;

  const handleWidthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(100, Math.min(2000, value));
    onWidthChange(clamped);

    if (lockAspectRatio) {
      const newHeight = Math.round(clamped / aspectRatio);
      onHeightChange(Math.max(100, Math.min(2000, newHeight)));
    }
  };

  const handleHeightInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(100, Math.min(2000, value));
    onHeightChange(clamped);

    if (lockAspectRatio) {
      const newWidth = Math.round(clamped * aspectRatio);
      onWidthChange(Math.max(100, Math.min(2000, newWidth)));
    }
  };

  const handleWidthSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onWidthChange(value);

    if (lockAspectRatio) {
      const newHeight = Math.round(value / aspectRatio);
      onHeightChange(Math.max(100, Math.min(2000, newHeight)));
    }
  };

  const handleHeightSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    onHeightChange(value);

    if (lockAspectRatio) {
      const newWidth = Math.round(value * aspectRatio);
      onWidthChange(Math.max(100, Math.min(2000, newWidth)));
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-medium text-gray-900">출력 크기</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          너비:
          <input
            type="number"
            min={100}
            max={2000}
            step={10}
            value={outputWidth}
            onChange={handleWidthInputChange}
            className="w-20 mx-2 px-2 py-1 border rounded"
          />
          px
        </label>
        <input
          type="range"
          min={100}
          max={2000}
          step={10}
          value={outputWidth}
          onChange={handleWidthSliderChange}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          높이:
          <input
            type="number"
            min={100}
            max={2000}
            step={10}
            value={outputHeight}
            onChange={handleHeightInputChange}
            className="w-20 mx-2 px-2 py-1 border rounded"
          />
          px
        </label>
        <input
          type="range"
          min={100}
          max={2000}
          step={10}
          value={outputHeight}
          onChange={handleHeightSliderChange}
          className="w-full"
        />
      </div>

      <div>
        <button
          onClick={() => onLockAspectRatioChange(!lockAspectRatio)}
          className={`w-full px-4 py-2 rounded ${
            lockAspectRatio
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {lockAspectRatio ? '비율 고정: ON' : '비율 고정: OFF'}
        </button>
      </div>
    </div>
  );
}

export default UpscaleControls;
