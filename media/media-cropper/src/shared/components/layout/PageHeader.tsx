import React from 'react';
import { useNavigate } from 'react-router';

interface PageHeaderProps {
  title: string;
  showHomeButton?: boolean;
  homeButtonLabel?: string;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  showHomeButton = true,
  homeButtonLabel = '홈으로',
  className = ''
}) => {
  const navigate = useNavigate();

  return (
    <div className={`flex justify-between items-center mb-8 ${className}`}>
      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
      {showHomeButton && (
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          {homeButtonLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;