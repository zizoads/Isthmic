
import React, { useState } from 'react';
import DiscoveryDashboard from '../DiscoveryDashboard';
import EvaluationDashboard from '../EvaluationDashboard';
import DropSniperDashboard from '../DropSniperDashboard';
import PurchaseDashboard from '../PurchaseDashboard';
import MapsTargeter from '../MapsTargeter';
import ForensicAuditGrid from '../ForensicAuditGrid';
import { Domain } from '../../types';
import { translations } from '../../translations';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: any) => void;
  lang: 'ar' | 'en';
}

const AcquisitionDesk: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const [mode, setMode] = useState<'mine' | 'audit' | 'sniper' | 'checkout' | 'maps'>('mine');
  const t = translations[lang];

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
         <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
               {lang === 'ar' ? 'مكتب الاستحواذ' : 'ACQUISITION DESK'}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed border-r-4 border-indigo-500/20 pr-6">
               {lang === 'ar' 
                  ? 'التنقيب عن الفرص غير المكتشفة، التدقيق في سلامة العلامات التجارية، واقتناص النطاقات الساقطة بدقة جراحية.'
                  : 'Mining for undiscovered opportunities, auditing trademark integrity, and sniping dropping domains with surgical precision.'}
            </p>
         </div>
         <div className="flex bg-[#0b0e14]/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white/10 shadow-2xl overflow-x-auto max-w-full scrollbar-hide" role="tablist">
            {[
              { id: 'mine', label: lang === 'ar' ? 'التنقيب' : 'MINING', tip: t.tooltip_mining_engine },
              { id: 'audit', label: lang === 'ar' ? 'التدقيق' : 'AUDIT', tip: t.tooltip_forensic_audit },
              { id: 'maps', label: lang === 'ar' ? 'الخرائط' : 'MAPS', tip: '' },
              { id: 'sniper', label: lang === 'ar' ? 'القناص' : 'SNIPER', tip: t.tooltip_sniper },
              { id: 'checkout', label: lang === 'ar' ? 'التنفيذ' : 'EXECUTE', tip: t.tooltip_checkout }
            ].map(tab => (
              <button 
                key={tab.id}
                role="tab"
                aria-selected={mode === tab.id}
                aria-label={tab.label}
                onClick={() => setMode(tab.id as any)} 
                title={tab.tip}
                className={`px-8 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${mode === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
              >
                {tab.label}
              </button>
            ))}
         </div>
      </div>

      <div className="pt-4">
        {mode === 'mine' && <DiscoveryDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />}
        {mode === 'audit' && (
          <div className="space-y-12">
             <ForensicAuditGrid domains={domains} lang={lang} />
             <EvaluationDashboard domains={domains} setDomains={setDomains} addLog={addLog} lang={lang} />
          </div>
        )}
        {mode === 'maps' && <MapsTargeter lang={lang} />}
        {mode === 'sniper' && <DropSniperDashboard lang={lang} />}
        {mode === 'checkout' && <PurchaseDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default AcquisitionDesk;
