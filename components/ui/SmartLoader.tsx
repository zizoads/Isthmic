import React from 'react';

interface Props {
  stage: 'connecting' | 'processing' | 'finalizing';
  message: string;
  subMessage?: string;
  progress?: number;
}

export const SmartLoader: React.FC<Props> = ({ stage, message, subMessage, progress }) => {
  const stages = {
    connecting: { color: 'text-blue-500', icon: 'fa-plug-combined' },
    processing: { color: 'text-amber-500', icon: 'fa-microchip' },
    finalizing: { color: 'text-green-500', icon: 'fa-shield-check' }
  };

  const current = stages[stage];

  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8 animate-precision">
      <div className="relative">
        <div className={`w-24 h-24 rounded-[32px] border-2 border-white/5 flex items-center justify-center text-3xl ${current.color} shadow-2xl`}>
          <i className={`fas ${current.icon} ${stage === 'processing' ? 'fa-spin' : 'animate-pulse'}`}></i>
        </div>
        {progress !== undefined && (
          <svg className="absolute -inset-2 w-28 h-28 -rotate-90">
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-white/5"
            />
            <circle
              cx="56"
              cy="56"
              r="52"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 - (326.7 * progress) / 100}
              className={`${current.color} transition-all duration-500`}
            />
          </svg>
        )}
      </div>

      <div className="text-center space-y-2">
        <h3 className="text-xl font-black text-white italic tracking-tight">{message}</h3>
        {subMessage && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">{subMessage}</p>}
      </div>

      <div className="flex gap-2">
        {Object.keys(stages).map((s) => (
          <div key={s} className={`w-2 h-2 rounded-full transition-all duration-500 ${stage === s ? 'bg-white scale-125' : 'bg-white/10'}`}></div>
        ))}
      </div>
    </div>
  );
};