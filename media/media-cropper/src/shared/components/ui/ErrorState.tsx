import React from 'react';

interface ErrorStateProps {
  title?: string;
  message: string;
  variant?: 'centered' | 'card';
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  variant = 'centered',
  action,
  className = ''
}) => {
  const getContainerClasses = () => {
    const baseClasses = 'text-center';

    if (variant === 'card') {
      return `${baseClasses} max-w-md bg-white p-8 rounded-lg shadow`;
    }

    return baseClasses;
  };

  const getTitleClasses = () => {
    if (variant === 'card') {
      return 'text-2xl font-bold text-gray-900 mb-4';
    }
    return '';
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {title && <h2 className={getTitleClasses()}>{title}</h2>}
      <p className="text-gray-600 mb-4">{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default ErrorState;