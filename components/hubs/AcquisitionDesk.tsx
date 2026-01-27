
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import OsintIntelligencePanel from '../OsintIntelligencePanel';
import ForensicAuditGrid from '../ForensicAuditGrid';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const AcquisitionDesk: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const [mode, setMode] = useState<'mine' | 'audit' | 'osint' | 'sniper' | 'checkout'>('mine');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setMode('mine')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'mine' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التنقيب الاستراتيجي' : 'MINING ENGINE'}
        </button>
        <button onClick={() => setMode('audit')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'audit' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التدقيق والربحية' : 'FORENSIC AUDIT'}
        </button>
        <button onClick={() => setMode('osint')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'osint' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'رادار الاستخبارات' : 'OSINT RADAR'}
        </button>
        <button onClick={() => setMode('sniper')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'sniper' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'القناص القسري' : 'PRECISION SNIPER'}
        </button>
        <button onClick={() => setMode('checkout')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${mode === 'checkout' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'تنفيذ الاستثمار' : 'EXECUTE BUY'}
        </button>
      </div>

      <div className="pt-4">
        {mode === 'mine' && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
        {mode === 'audit' && (
          <div className="space-y-8">
             <ForensicAuditGrid domains={domains} lang={lang} />
             <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />
          </div>
        )}
        {mode === 'osint' && <OsintIntelligencePanel lang={lang} />}
        {mode === 'sniper' && <DropSniperDashboard lang={lang} />}
        {mode === 'checkout' && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default AcquisitionDesk;
