import React, { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  children: React.ReactNode;
}

export default function Tooltip({ content, position = 'top', delay = 300, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        let x = 0;
        let y = 0;

        switch (position) {
          case 'top':
            x = rect.left + rect.width / 2;
            y = rect.top;
            break;
          case 'bottom':
            x = rect.left + rect.width / 2;
            y = rect.bottom;
            break;
          case 'left':
            x = rect.left;
            y = rect.top + rect.height / 2;
            break;
          case 'right':
            x = rect.right;
            y = rect.top + rect.height / 2;
            break;
        }

        // 화면 경계를 벗어나지 않도록 위치 조정
        if (x < 100) x = 100;
        if (x > window.innerWidth - 100) x = window.innerWidth - 100;
        if (y < 100) y = 100;
        if (y > window.innerHeight - 100) y = window.innerHeight - 100;

        setTooltipPosition({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const getTooltipStyles = () => {
    const baseStyles = {
      position: 'fixed' as const,
      zIndex: 50,
      transition: 'all 0.2s ease-in-out',
      pointerEvents: 'none' as const,
    };

    const positionStyles = {
      top: {
        transform: `translate(-50%, -100%) translateY(-8px)`,
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      },
      bottom: {
        transform: 'translate(-50%, 8px)',
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      },
      left: {
        transform: 'translate(-100%, -50%) translateX(-8px)',
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      },
      right: {
        transform: 'translateY(-50%) translateX(8px)',
        left: tooltipPosition.x,
        top: tooltipPosition.y,
      },
    };

    return { ...baseStyles, ...positionStyles[position] };
  };

  return (
    <>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="inline-block">
        {children}
      </div>

      {isVisible && (
        <div
          style={getTooltipStyles()}
          className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg max-w-xs"
          role="tooltip"
        >
          <div className="relative">
            {content}
            <div
              className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === 'top'
                  ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1'
                  : position === 'bottom'
                    ? 'top-0 left-1/2 -translate-x-1/2 -translate-y-1'
                    : position === 'left'
                      ? 'right-0 top-1/2 -translate-y-1/2 translate-x-1'
                      : 'left-0 top-1/2 -translate-y-1/2 -translate-x-1'
              }`}
            />
          </div>
        </div>
      )}
    </>
  );
}
