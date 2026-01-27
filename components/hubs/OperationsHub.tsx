
import React, { useState } from 'react';
import PipelineDashboard from '../PipelineDashboard';
import PortfolioManager from '../PortfolioManager';
import ValueProofDashboard from '../ValueProofDashboard';
import ForensicAuditGrid from '../ForensicAuditGrid';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  lang: 'ar' | 'en';
}

const OperationsHub: React.FC<Props> = ({ domains, setDomains, onInspect, lang }) => {
  const [view, setView] = useState<'pipeline' | 'forensic' | 'branding' | 'scaling'>('pipeline');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Sub-Navigation: Goal-Oriented */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setView('pipeline')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'pipeline' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'خط الإنتاج' : 'PIPELINE'}
        </button>
        <button onClick={() => setView('forensic')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'forensic' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التدقيق الجنائي' : 'FORENSIC AUDIT'}
        </button>
        <button onClick={() => setView('branding')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'branding' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'هندسة الهوية' : 'BRANDING'}
        </button>
        <button onClick={() => setView('scaling')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${view === 'scaling' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'إثبات القيمة' : 'VALUE PROOF'}
        </button>
      </div>

      <div className="pt-4">
        {view === 'pipeline' && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={onInspect} lang={lang} />}
        {view === 'forensic' && <ForensicAuditGrid domains={domains} lang={lang} />}
        {view === 'branding' && <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />}
        {view === 'scaling' && <ValueProofDashboard domains={domains} lang={lang} />}
      </div>
    </div>
  );
};

export default OperationsHub;
