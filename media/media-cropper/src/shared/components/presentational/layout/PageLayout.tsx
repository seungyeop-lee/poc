import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  containerWidth?: 'narrow' | 'wide';
  centered?: boolean;
  padding?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  containerWidth = 'wide',
  centered = false,
  padding = 'p-8',
  className = ''
}) => {
  const getContainerClasses = () => {
    const baseClasses = 'min-h-screen bg-gray-100';

    if (centered) {
      return `${baseClasses} flex items-center justify-center`;
    }

    return `${baseClasses} ${padding}`;
  };

  const getWidthClasses = () => {
    if (centered) {
      return containerWidth === 'narrow' ? 'max-w-2xl w-full px-4' : 'max-w-6xl w-full px-4';
    }

    return containerWidth === 'narrow' ? 'max-w-2xl mx-auto' : 'max-w-6xl mx-auto';
  };

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      <div className={getWidthClasses()}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;