
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
    <div className="space-y-16 animate-silk pb-24">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12">
         <div className="space-y-6">
            <h2 className="text-5xl lg:text-7xl prestige-heading text-white italic leading-none">
               {lang === 'ar' ? 'الجناح التنفيذي النخبوي' : 'Executive Elite Atelier'}
            </h2>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed border-r-2 border-[#c5a059]/40 pr-8 italic">
               {lang === 'ar' 
                  ? 'رؤية شاملة للأصول الرقمية، مصاغة بلغة تليق بالقادة، مع إدارة تكتيكية لبروتوكولات الاتصال.'
                  : 'A holistic vision of digital assets, crafted in a language fit for leaders, with tactical orchestration of connection protocols.'}
            </p>
         </div>
         <div className="flex bg-[#161618] p-2 rounded-3xl border border-white/5 shadow-2xl">
           {[
             { id: 'reports', label: lang === 'ar' ? 'التقارير السيادية' : 'SOVEREIGN REPORTS' },
             { id: 'integrations', label: lang === 'ar' ? 'بروتوكولات الربط' : 'CONNECTIVITY' }
           ].map(tab => (
             <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)} 
                className={`px-12 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                  ${activeTab === tab.id ? 'bg-white text-black shadow-lg' : 'text-slate-500 hover:text-white'}`}
             >
                {tab.label}
             </button>
           ))}
         </div>
      </div>

      <div className="pt-10">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
