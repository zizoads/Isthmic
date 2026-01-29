
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

      {/* Production Readiness Banner */}
      <div className="bg-[#c5a059]/5 border border-[#c5a059]/20 p-8 rounded-[32px] flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-[#c5a059]/10 rounded-2xl flex items-center justify-center text-[#c5a059]">
               <i className="fas fa-server"></i>
            </div>
            <div>
               <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Production_Status</h4>
               <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">
                  {lang === 'ar' ? 'بيئة العمل: السحابة السيادية' : 'Environment: Sovereign Cloud'} • SSL_SECURE
               </p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="px-6 py-2 bg-white/5 rounded-full border border-white/10 text-[8px] font-black text-slate-400 uppercase tracking-widest">
               Latency: 42ms
            </div>
            <div className="px-6 py-2 bg-green-500/10 rounded-full border border-green-500/20 text-[8px] font-black text-green-500 uppercase tracking-widest">
               API: ACTIVE
            </div>
         </div>
      </div>

      <div className="pt-4">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
