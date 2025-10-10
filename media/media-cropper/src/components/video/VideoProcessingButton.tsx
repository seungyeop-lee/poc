import { LoadingSpinner } from '../ui';

interface VideoProcessingButtonProps {
  isProcessing: boolean;
  progress: number;
  onCropAndTrim: () => void;
  disabled?: boolean;
  label?: string;
  processingLabel?: string;
}

export default function VideoProcessingButton({
  isProcessing,
  progress,
  onCropAndTrim,
  disabled = false,
  label = '크롭 및 트림 실행',
  processingLabel = '처리 중...'
}: VideoProcessingButtonProps) {
  return (
    <button
      onClick={onCropAndTrim}
      disabled={disabled || isProcessing}
      className="w-full px-6 py-3 h-12 min-h-12 max-h-14 bg-blue-500 text-white rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-gray-400 transition-all duration-200 text-base font-medium sm:text-sm sm:px-4 sm:h-10 sm:min-h-10 sm:max-h-12 shadow-sm hover:shadow-md disabled:shadow-none disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <LoadingSpinner size="small" message={processingLabel} progress={progress} />
      ) : (
        label
      )}
    </button>
  );
}