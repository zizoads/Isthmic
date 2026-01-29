
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import MapsTargeter from '../MapsTargeter';
import ForensicAuditGrid from '../ForensicAuditGrid';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const AcquisitionDesk: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const [mode, setMode] = useState<'mine' | 'audit' | 'sniper' | 'checkout' | 'maps'>('mine');

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
         <div className="space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
               ACQUISITION DESK
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed border-l-4 border-indigo-500/20 pl-6">
               Mining for undiscovered opportunities, auditing trademark integrity, and sniping dropping domains with surgical precision.
            </p>
         </div>
         <div className="flex bg-[#0b0e14]/80 backdrop-blur-md p-1.5 rounded-[22px] border border-white/10 shadow-2xl overflow-x-auto max-w-full scrollbar-hide" role="tablist">
            {[
              { id: 'mine', label: 'MINING' },
              { id: 'audit', label: 'AUDIT' },
              { id: 'maps', label: 'MAPS' },
              { id: 'sniper', label: 'SNIPER' },
              { id: 'checkout', label: 'EXECUTE' }
            ].map(tab => (
              <button 
                key={tab.id}
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id as any)} 
                className={`px-6 py-2.5 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${mode === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="pt-4">
        {mode === 'mine' && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />}
        {mode === 'audit' && (
          <div className="space-y-12">
             <ForensicAuditGrid domains={domains} lang="en" />
             <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang="en" />
          </div>
        )}
        {mode === 'maps' && <MapsTargeter lang="en" />}
        {mode === 'sniper' && <DropSniperDashboard lang="en" />}
        {mode === 'checkout' && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default AcquisitionDesk;
