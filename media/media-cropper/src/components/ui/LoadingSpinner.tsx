import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  progress?: number; // 0-1 사이 값
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  message,
  progress,
  className = ''
}) => {
  const getSpinnerClasses = () => {
    const baseClasses = 'animate-spin rounded-full border-2 border-gray-300 border-t-blue-500';

    switch (size) {
      case 'small':
        return `${baseClasses} w-4 h-4`;
      case 'large':
        return `${baseClasses} w-8 h-8`;
      default: // medium
        return `${baseClasses} w-6 h-6`;
    }
  };

  const getTextClasses = () => {
    switch (size) {
      case 'small':
        return 'text-sm';
      case 'large':
        return 'text-lg';
      default: // medium
        return 'text-base';
    }
  };

  const getProgressText = () => {
    if (progress !== undefined) {
      return ` ${Math.round(progress * 100)}%`;
    }
    return '';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={getSpinnerClasses()} />
      {message && (
        <span className={`${getTextClasses()} text-gray-600`}>
          {message}{getProgressText()}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;