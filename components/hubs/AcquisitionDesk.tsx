
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import MapsTargeter from '../MapsTargeter';
import ForensicAuditGrid from '../ForensicAuditGrid';
import OsintIntelligencePanel from '../OsintIntelligencePanel';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const AcquisitionDesk: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const [mode, setMode] = useState<'mine' | 'audit' | 'osint' | 'maps' | 'sniper' | 'checkout'>('mine');

  return (
    <div className="space-y-8 lg:space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 lg:gap-10">
         <div className="space-y-2 lg:space-y-4">
            <h2 className="text-3xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
               ACQUISITION DESK
            </h2>
            <p className="text-slate-500 text-[11px] lg:text-sm max-w-2xl font-medium leading-relaxed border-l-2 lg:border-l-4 border-indigo-500/20 pl-4 lg:pl-6">
               Mining for opportunities, auditing trademark integrity, and sniping dropping domains with surgical precision.
            </p>
         </div>
         <div className="flex bg-[#0b0e14]/80 backdrop-blur-md p-1.5 rounded-[22px] border border-white/10 shadow-2xl w-full lg:w-auto scroll-x-mobile" role="tablist">
            {[
              { id: 'mine', label: 'MINING' },
              { id: 'audit', label: 'AUDIT' },
              { id: 'osint', label: 'OSINT' },
              { id: 'maps', label: 'MAPS' },
              { id: 'sniper', label: 'SNIPER' },
              { id: 'checkout', label: 'EXECUTE' }
            ].map(tab => (
              <button 
                key={tab.id}
                role="tab"
                aria-selected={mode === tab.id}
                onClick={() => setMode(tab.id as any)} 
                className={`flex-1 lg:flex-none px-5 lg:px-6 py-2.5 rounded-[16px] text-[8px] lg:text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${mode === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="pt-4 lg:pt-8">
        {mode === 'mine' && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
        {mode === 'audit' && (
          <div className="space-y-12">
             <div className="overflow-x-auto no-scrollbar -mx-4 lg:mx-0 px-4 lg:px-0">
               <ForensicAuditGrid domains={domains} lang={lang} />
             </div>
             <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />
          </div>
        )}
        {mode === 'osint' && <OsintIntelligencePanel lang={lang} />}
        {mode === 'maps' && <MapsTargeter lang={lang} />}
        {mode === 'sniper' && <DropSniperDashboard lang={lang} />}
        {mode === 'checkout' && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default AcquisitionDesk;
