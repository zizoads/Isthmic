
import React, { useState } from 'react';
import ExecutiveReportDashboard from '../ExecutiveReportDashboard';
import IntegrationCenter from '../IntegrationCenter';
import { Domain, PlatformStats, ServiceIntegration } from '../../types';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
  lang: 'ar' | 'en';
}

const ExecutiveSuite: React.FC<Props> = ({ domains, stats, integrations, onConnect, lang }) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'integrations'>('reports');

  return (
    <div className="space-y-12 animate-fade-in pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10">
         <div className="space-y-4">
            <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter uppercase italic leading-none">
               {lang === 'ar' ? 'الجناح التنفيذي' : 'EXECUTIVE SUITE'}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed border-r-4 border-indigo-500/20 pr-6">
               {lang === 'ar' 
                  ? 'مركز الرقابة العليا، التقارير المالية الاستباقية، وإدارة تكامل البروتوكولات الخارجية للذكاء الاصطناعي.'
                  : 'High-level oversight, proactive financial reporting, and external AI protocol integration management.'}
            </p>
         </div>
         <div className="flex bg-[#0b0e14]/50 backdrop-blur-md p-1.5 rounded-[24px] border border-white/10 shadow-2xl">
           {[
             { id: 'reports', label: lang === 'ar' ? 'التقارير' : 'REPORTS' },
             { id: 'integrations', label: lang === 'ar' ? 'التكامل' : 'CONNECT' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-10 py-3 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="pt-6">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
