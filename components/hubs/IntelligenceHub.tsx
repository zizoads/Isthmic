
import React from 'react';
import { useDomainContext } from '../../context/DomainContext';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import { PlatformStats } from '../../types';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  isScanning: boolean;
  onInitiateScan: () => void;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang }) => {
  const { strategy, setStrategy, addLog, setDomains } = useDomainContext();

  return (
    <div className="space-y-12 animate-precision">
      <header className="flex justify-between items-end">
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-7xl prestige-heading text-white italic leading-none">
            Intelligence Hub
          </h1>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Alignment Velocity:</span>
                <span className={`text-sm font-black ${stats.alignmentVelocity >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                   {stats.alignmentVelocity >= 0 ? '+' : ''}{stats.alignmentVelocity}% / cycle
                </span>
             </div>
             <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${Math.min(100, Math.abs(stats.alignmentVelocity) * 5)}%` }}></div>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-12">
        <MasterBrainDashboard 
          stats={stats} 
          activityLogs={[]} 
          strategy={strategy} 
          setStrategy={setStrategy} 
          lang={lang} 
        />
        <NexusPrimeDashboard 
          lang={lang} 
          addLog={addLog} 
          setDomains={setDomains} 
        />
      </div>
    </div>
  );
};

export default IntelligenceHub;
