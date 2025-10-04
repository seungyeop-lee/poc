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
  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-4">
      <h3 className="font-medium text-gray-900">트림 설정</h3>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          시작 시간: {startTime.toFixed(1)}초
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
          종료 시간: {endTime.toFixed(1)}초
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
