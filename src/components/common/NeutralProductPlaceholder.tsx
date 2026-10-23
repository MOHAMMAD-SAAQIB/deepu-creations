import React from 'react';
import { ImageOff, Sparkles } from 'lucide-react';

interface NeutralProductPlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export const NeutralProductPlaceholder: React.FC<NeutralProductPlaceholderProps> = ({
  className = '',
  size = 'md',
  message = 'Awaiting product image upload',
}) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div
      className={`w-full h-full min-h-[160px] bg-[#FAF6F0] border border-[#E6D7CD] flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      aria-label="Product image placeholder"
    >
      <div className="w-12 h-12 rounded-2xl bg-[#F0C9CB]/30 border border-[#D99AA3]/40 flex items-center justify-center text-[#6E3947] mb-2 shadow-xs">
        <ImageOff className={iconSizes[size]} />
      </div>
      <p className={`font-serif font-medium text-[#321923] ${textSizes[size]}`}>
        Deepu Creations Atelier
      </p>
      <p className="text-[10px] text-[#8E987E] mt-0.5 max-w-[180px] leading-tight">
        {message}
      </p>
      <div className="mt-2 flex items-center gap-1 text-[9px] text-[#D99AA3] font-mono">
        <Sparkles className="w-2.5 h-2.5" />
        <span>Handcrafted with Love</span>
      </div>
    </div>
  );
};
