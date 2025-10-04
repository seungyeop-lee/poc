interface TrimControlsProps {
  startTime: number;
  endTime: number;
  duration: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
}

function TrimControls({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
}: TrimControlsProps) {
  const handleStartTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(0, Math.min(duration, value));
    onStartTimeChange(clamped);
  };

  const handleEndTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (isNaN(value)) return;
    const clamped = Math.max(0, Math.min(duration, value));
    onEndTimeChange(clamped);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-medium text-gray-900">트림 설정</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          시작 시간:
          <input
            type="number"
            min={0}
            max={duration}
            step={0.1}
            value={startTime}
            onChange={handleStartTimeInputChange}
            className="w-20 mx-2 px-2 py-1 border rounded"
          />
          초
        </label>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={startTime}
          onChange={(e) => onStartTimeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          종료 시간:
          <input
            type="number"
            min={0}
            max={duration}
            step={0.1}
            value={endTime}
            onChange={handleEndTimeInputChange}
            className="w-20 mx-2 px-2 py-1 border rounded"
          />
          초
        </label>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.1}
          value={endTime}
          onChange={(e) => onEndTimeChange(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="text-sm text-gray-600">
        선택된 범위: {(endTime - startTime).toFixed(1)}초
      </div>
    </div>
  );
}

export default TrimControls;
