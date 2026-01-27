
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import MapsTargeter from '../MapsTargeter';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const AcquisitionDesk: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const [mode, setMode] = useState<'discovery' | 'audit' | 'sniper' | 'checkout' | 'maps'>('discovery');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setMode('discovery')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'discovery' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الاستكشاف' : 'Discovery'}
        </button>
        <button onClick={() => setMode('audit')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'audit' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التدقيق الجنائي' : 'Forensic Audit'}
        </button>
        <button onClick={() => setMode('maps')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'maps' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'رادار الخرائط' : 'Maps Radar'}
        </button>
        <button onClick={() => setMode('sniper')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'sniper' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'قناص الـ Drop' : 'Drop Sniper'}
        </button>
        <button onClick={() => setMode('checkout')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'checkout' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'تنفيذ الشراء' : 'Checkout'}
        </button>
      </div>

      <div className="pt-4">
        {mode === 'discovery' && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
        {mode === 'audit' && <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
        {mode === 'maps' && <MapsTargeter lang={lang} />}
        {mode === 'sniper' && <DropSniperDashboard lang={lang} />}
        {mode === 'checkout' && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default AcquisitionDesk;
