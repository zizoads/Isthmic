
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0">
        <button onClick={() => setActiveTab('reports')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reports' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التقارير التنفيذية' : 'Executive Reports'}
        </button>
        <button onClick={() => setActiveTab('integrations')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'integrations' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الإعدادات والربط' : 'Integrations'}
        </button>
      </div>

      <div className="pt-4">
        {activeTab === 'reports' && <ExecutiveReportDashboard domains={domains} stats={stats} lang={lang} />}
        {activeTab === 'integrations' && <IntegrationCenter integrations={integrations} onConnect={onConnect} lang={lang} />}
      </div>
    </div>
  );
};

export default ExecutiveSuite;
