import React from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content, className }) => {
  return (
    <div className="relative group">
      {children}
      <div
        className={`absolute bottom-full left-1/2 z-20 mb-2 w-max max-w-xs -translate-x-1/2 transform rounded-lg bg-[#111111] px-3 py-2 text-center text-sm font-normal text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 border border-green-500/30 shadow-lg pointer-events-none ${className}`}
        role="tooltip"
      >
        <div className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-[#111111] border-b border-r border-green-500/30"></div>
        {content}
      </div>
    </div>
  );
};

export default Tooltip;