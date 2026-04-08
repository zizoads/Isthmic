
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import { BrandForgeHub } from '../BrandForgeHub';
import { useDomainContext } from '../../../context/DomainContext';
import { PlatformStats, Domain } from '../../../types';

interface Props {
  stats: PlatformStats;
  domains: Domain[];
}

const AlphaMineHub: React.FC<Props> = ({ domains }) => {
  const [mode, setMode] = useState<'mining' | 'execute' | 'forge'>('mining');
  const { addLog } = useDomainContext();

  return (
    <div className="space-y-12 animate-precision">
      <header className="flex flex-col lg:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-2">
           <h2 className="text-4xl prestige-title text-white italic">Alpha Mine.</h2>
           <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.5em]">Targeting High-Liquidity Digital Assets</p>
        </div>
        
        <div className="flex bg-[#0D0D10] p-1.5 rounded-2xl border border-white/5 shadow-xl overflow-x-auto no-scrollbar max-w-full">
          {[
            { id: 'mining', label: 'MINING & SNIPER', icon: 'fa-bolt' },
            { id: 'forge', label: 'BRAND FORGE', icon: 'fa-fire' },
            { id: 'execute', label: 'AUDIT & EXECUTE', icon: 'fa-shopping-cart' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setMode(tab.id as any)} 
              className={`flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${mode === tab.id ? 'bg-white text-black shadow-lg scale-105' : 'text-slate-600 hover:text-white'}`}
            >
              <i className={`fas ${tab.icon} text-[9px]`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      <div className="min-h-[500px]">
        {mode === 'mining' && (
          <div className="space-y-12">
            <DiscoveryDashboard domains={domains} addLog={addLog} />
            <DropSniperDashboard />
          </div>
        )}
        {mode === 'forge' && (
          <BrandForgeHub />
        )}
        {mode === 'execute' && (
          <div className="space-y-12">
            <EvaluationDashboard domains={domains} addLog={addLog} />
            <PurchaseDashboard domains={domains} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AlphaMineHub;
