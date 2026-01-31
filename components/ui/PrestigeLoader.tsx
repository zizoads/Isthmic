
import React from 'react';

interface Props {
  label?: string;
}

const PrestigeLoader: React.FC<Props> = ({ label }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in py-12">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-2 border-[#d4af37]/20 rounded-full"></div>
        <div className="absolute inset-0 border-t-2 border-[#d4af37] rounded-full animate-spin"></div>
        <div className="absolute inset-4 border border-[#d4af37]/10 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-2 h-2 bg-[#d4af37] rounded-full shadow-[0_0_15px_#d4af37]"></div>
        </div>
      </div>
      {label && (
        <div className="text-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em] animate-pulse">
            {label}
          </span>
        </div>
      )}
    </div>
  );
};

export default PrestigeLoader;
