
import React, { useState, useEffect } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import AutonomousControlCenter from '../AutonomousControlCenter';
import WorkflowIndicator from '../WorkflowIndicator';
import StrategicBriefingBadge from '../negotiation/StrategicBriefingBadge';
import { PlatformStats, WorkflowState, StrategicObjective } from '../../types';
import { useDomainContext } from '../../context/DomainContext';
import { useMasterBrain } from '../../hooks/useMasterBrain';
import { useSovereignT } from '../../hooks/useTranslation';
import { OrchestrationService } from '../../services/ai/OrchestrationService';

interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan: () => void;
  isScanning: boolean;
  activeWorkflow?: WorkflowState | null;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning, activeWorkflow: propsActiveWorkflow }) => {
  const { activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);
  const t = useSovereignT(lang);
  
  const { activeWorkflow: localActiveWorkflow } = useMasterBrain(strategy, lang);
  const currentWorkflow = propsActiveWorkflow !== undefined ? propsActiveWorkflow : localActiveWorkflow;

  // Phase 1: محاكاة توليد الأهداف عند تحديث الفلسفة الاستثمارية
  useEffect(() => {
    if (strategy.investmentThesis && objectives.length === 0) {
      OrchestrationService.generateInitialObjectives(strategy.investmentThesis).then(res => {
        setObjectives(res);
        addLog('Master Brain', 'Strategic Objectives Synthesized from Intent.', 'success');
      });
    }
  }, [strategy.investmentThesis]);

  const tabs = [
    { id: 'sovereign', label: t('intelligence.tabs.command'), icon: 'fa-terminal' },
    { id: 'nexus', label: t('intelligence.tabs.radar'), icon: 'fa-satellite-dish' },
    { id: 'strategy', label: t('intelligence.tabs.thesis'), icon: 'fa-scroll' },
    { id: 'feedback', label: t('intelligence.tabs.neural'), icon: 'fa-brain' }
  ];

  const navigateToKeySetup = () => {
    addLog('System', lang === 'ar' ? 'يرجى الانتقال إلى الجناح التنفيذي (Executive) لإدارة المفاتيح.' : 'Please navigate to Executive Suite to manage API keys.', 'info');
  };

  return (
    <div className="space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Strategic Observer - Phase 1 UI */}
      <StrategicBriefingBadge objectives={objectives} lang={lang} />

      <header className="space-y-4">
        <div className="flex items-center gap-4">
           <div className="w-2 h-8 bg-[#c5a059]"></div>
           <h1 className="text-4xl lg:text-7xl prestige-heading text-white italic leading-none">
             {t('intelligence.hub_title')}
           </h1>
        </div>
      </header>

      <div className={`flex bg-white/5 backdrop-blur-2xl p-1.5 rounded-[24px] border border-white/5 w-fit shadow-2xl ${lang === 'ar' ? 'mr-0 ml-auto lg:mr-0' : 'mx-auto lg:mx-0'}`}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)} 
            className={`px-8 py-3 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3
              ${subTab === tab.id ? 'bg-white text-black shadow-xl scale-105' : 'text-slate-500 hover:text-white'}`}
          >
            <i className={`fas ${tab.icon} text-[10px]`}></i>
            <span className="hidden sm:inline" dangerouslySetInnerHTML={{ __html: tab.label }}></span>
          </button>
        ))}
      </div>

      {currentWorkflow && (
        <div className={`max-w-4xl ${lang === 'ar' ? 'mr-0' : 'mx-auto lg:mx-0'}`}>
          <WorkflowIndicator workflow={currentWorkflow} lang={lang} />
        </div>
      )}

      <div className="animate-fade-in space-y-12">
        {subTab === 'sovereign' && (
          <div className="space-y-12">
            {/* عرض ملخص الأهداف (Silent Mode) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-60 hover:opacity-100 transition-opacity">
               {objectives.map(obj => (
                 <div key={obj.id} className="p-6 bg-white/2 border border-white/5 rounded-3xl flex justify-between items-center">
                    <div>
                       <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{obj.category}</div>
                       <div className="text-sm font-bold text-white italic">{obj.description}</div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs font-black text-[#c5a059]">{obj.currentValue} / {obj.targetValue} {obj.unit}</div>
                       <div className="text-[7px] font-mono text-slate-600 uppercase">Status: {obj.status}</div>
                    </div>
                 </div>
               ))}
            </div>
            
            <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
            />
            <MarketMomentumChart lang={lang} />
          </div>
        )}
        
        {subTab === 'nexus' && <div className="glass-panel p-12"><NexusPrimeDashboard lang={lang} addLog={addLog} setDomains={setDomains} /></div>}
        {subTab === 'strategy' && <div className="glass-panel p-12"><MasterBrainDashboard stats={stats} activityLogs={activityLogs} strategy={strategy} setStrategy={setStrategy} lang={lang} onInitiateScan={onInitiateScan} isScanning={isScanning} onNavigateToKeys={navigateToKeySetup} /></div>}
        {subTab === 'feedback' && <div className="glass-panel p-12"><FeedbackDashboard domains={[]} stats={stats} /></div>}
      </div>
    </div>
  );
};

export default IntelligenceHub;
