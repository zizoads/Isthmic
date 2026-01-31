import React from 'react';

interface Props {
  type: 'card' | 'list-item' | 'hero';
  count?: number;
}

const SovereignSkeleton: React.FC<Props> = ({ type, count = 1 }) => {
  const CardSkeleton = () => (
    <div className="glass-panel p-10 space-y-8 relative overflow-hidden group">
      <div className="flex justify-between items-start">
        <div className="h-8 w-40 bg-white/5 rounded-lg animate-shimmer"></div>
        <div className="h-6 w-20 bg-white/5 rounded-lg animate-shimmer"></div>
      </div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-white/5 rounded animate-shimmer"></div>
        <div className="h-4 w-2/3 bg-white/5 rounded animate-shimmer"></div>
      </div>
      <div className="pt-8 border-t border-white/5 flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-2 w-12 bg-white/5 rounded animate-shimmer"></div>
          <div className="h-6 w-16 bg-white/5 rounded animate-shimmer"></div>
        </div>
        <div className="w-12 h-12 bg-white/5 rounded-2xl animate-shimmer"></div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#c5a059]/5 to-transparent -translate-x-full animate-sweep"></div>
    </div>
  );

  const ListItemSkeleton = () => (
    <div className="p-8 border-b-2 border-white/5 flex justify-between items-center animate-pulse">
      <div className="space-y-3">
        <div className="h-6 w-48 bg-white/5 rounded"></div>
        <div className="h-3 w-24 bg-white/5 rounded opacity-50"></div>
      </div>
      <div className="h-10 w-24 bg-white/5 rounded-xl"></div>
    </div>
  );

  return (
    <div className={`grid ${type === 'card' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : 'grid-cols-1'} w-full`}>
      {Array.from({ length: count }).map((_, i) => (
        type === 'card' ? <CardSkeleton key={i} /> : <ListItemSkeleton key={i} />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { opacity: 0.3; }
        }
        @keyframes sweep {
          100% { transform: translateX(200%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite ease-in-out;
        }
        .animate-sweep {
          animation: sweep 3s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SovereignSkeleton;