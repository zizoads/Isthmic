
import React, { useState } from 'react';
import PipelineDashboard from '../PipelineDashboard';
import PortfolioManager from '../PortfolioManager';
import ValueProofDashboard from '../ValueProofDashboard';
import ValueMultiplierDashboard from '../ValueMultiplierDashboard';
import ForensicAuditGrid from '../ForensicAuditGrid';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  lang: 'ar' | 'en';
}

const OperationsHub: React.FC<Props> = ({ domains, setDomains, onInspect, lang }) => {
  const [view, setView] = useState<'pipeline' | 'forensic' | 'branding' | 'scaling' | 'multiplier'>('pipeline');

  return (
    <div className="space-y-12 lg:space-y-24 animate-fade-in pb-32 relative">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12">
         <div className="space-y-3">
            <h2 className="text-4xl lg:text-7xl prestige-heading text-white italic">
               Operations Hub
            </h2>
            <div className="flex items-center gap-4">
              <span className="h-[1px] w-12 bg-indigo-500/40"></span>
              <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] uppercase opacity-70">
                 Asset Engineering & Business Logic Scaling
              </p>
            </div>
         </div>
         
         <div className="flex bg-[#0D0D10] p-1.5 rounded-[22px] border border-white/5 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
           {[
             { id: 'pipeline', label: 'PIPELINE' },
             { id: 'forensic', label: 'AUDIT' },
             { id: 'branding', label: 'BRANDING' },
             { id: 'scaling', label: 'PROOF' },
             { id: 'multiplier', label: 'MULTIPLIER' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setView(tab.id as any)} 
                className={`px-8 py-3 rounded-[16px] text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${view === tab.id ? 'bg-white text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="grid grid-cols-1 gap-16">
        {view === 'pipeline' && (
          <div className="animate-slide-up">
            <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={onInspect} lang={lang} />
          </div>
        )}
        
        {view === 'forensic' && (
          <div className="space-y-16 animate-slide-up">
             <div className="square-card p-12 bg-gradient-to-br from-[#0D0D10] to-[#020204]">
                <ForensicAuditGrid domains={domains} lang={lang} />
             </div>
          </div>
        )}
        
        {view === 'branding' && (
          <div className="animate-slide-up">
            <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />
          </div>
        )}
        
        {view === 'scaling' && (
          <div className="animate-slide-up">
            <ValueProofDashboard domains={domains} lang={lang} />
          </div>
        )}

        {view === 'multiplier' && (
          <div className="animate-slide-up">
            <ValueMultiplierDashboard domains={domains} />
          </div>
        )}
      </div>

      <i className="fas fa-layer-group absolute right-[-100px] bottom-[-100px] text-white/[0.01] text-[400px] pointer-events-none rotate-12"></i>
    </div>
  );
};

export default OperationsHub;
