
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
    <div className="space-y-10 animate-fade-in">
      <div className="flex bg-accent/30 p-1.5 rounded-[24px] border border-border w-fit mx-auto lg:mx-0 shadow-inner">
        <button 
          onClick={() => setActiveTab('reports')} 
          className={`px-10 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-xl scale-105' : 'text-slate-500 hover:text-foreground'}`}
        >
          <i className={`fas fa-file-invoice ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></i>
          {lang === 'ar' ? 'التقارير التنفيذية' : 'Executive Reports'}
        </button>
        <button 
          onClick={() => setActiveTab('integrations')} 
          className={`px-10 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === 'integrations' ? 'bg-primary text-white shadow-xl scale-105' : 'text-slate-500 hover:text-foreground'}`}
        >
          <i className={`fas fa-plug-circle-check ${lang === 'ar' ? 'ml-2' : 'mr-2'}`}></i>
          {lang === 'ar' ? 'مركز الربط والتحكم' : 'Integrations & Control'}
        </button>
      </div>

      <div className="pt-6">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
