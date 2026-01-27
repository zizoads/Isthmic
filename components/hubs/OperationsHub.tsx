
import React, { useState } from 'react';
import PipelineDashboard from '../PipelineDashboard';
import PortfolioManager from '../PortfolioManager';
import ValueProofDashboard from '../ValueProofDashboard';
import ValueMultiplierDashboard from '../ValueMultiplierDashboard';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  onInspect: (d: Domain) => void;
  lang: 'ar' | 'en';
}

const OperationsHub: React.FC<Props> = ({ domains, setDomains, onInspect, lang }) => {
  const [view, setView] = useState<'pipeline' | 'branding' | 'scaling'>('pipeline');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0">
        <button onClick={() => setView('pipeline')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'pipeline' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'خط الإنتاج' : 'Pipeline'}
        </button>
        <button onClick={() => setView('branding')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'branding' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'هندسة الهوية' : 'Branding'}
        </button>
        <button onClick={() => setView('scaling')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'scaling' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'مضاعفة القيمة' : 'Value Scale'}
        </button>
      </div>

      <div className="pt-4">
        {view === 'pipeline' && <PipelineDashboard domains={domains} setDomains={setDomains} onInspect={onInspect} lang={lang} />}
        {view === 'branding' && <PortfolioManager domains={domains} setDomains={setDomains} lang={lang} />}
        {view === 'scaling' && (
          <div className="grid grid-cols-1 gap-10">
            <ValueProofDashboard domains={domains} />
            <ValueMultiplierDashboard domains={domains} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsHub;
