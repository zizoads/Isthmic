
import React, { useState } from 'react';
import MasterBrainDashboard from '../MasterBrainDashboard';
import NexusPrimeDashboard from '../NexusPrimeDashboard';
import FeedbackDashboard from '../FeedbackDashboard';
import MarketMomentumChart from '../MarketMomentumChart';
import AutonomousControlCenter from '../AutonomousControlCenter';
import { PlatformStats } from '../../types';
import { useDomainContext } from '../../context/DomainContext';

// Fixed Props interface to include scan control properties
interface Props {
  stats: PlatformStats;
  lang: 'ar' | 'en';
  onInitiateScan?: () => void;
  isScanning?: boolean;
}

const IntelligenceHub: React.FC<Props> = ({ stats, lang, onInitiateScan, isScanning }) => {
  const { activityLogs, strategy, setStrategy, addLog, setDomains } = useDomainContext();
  const [subTab, setSubTab] = useState<'sovereign' | 'nexus' | 'strategy' | 'feedback'>('sovereign');

  return (
    <div className="space-y-10 animate-fade-in relative pb-20">
      <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide shadow-xl">
        <button onClick={() => setSubTab('sovereign')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'sovereign' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'الإدارة السيادية' : 'SOVEREIGN CEO'}
        </button>
        <button onClick={() => setSubTab('nexus')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'nexus' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'رادار الفرص' : 'NEXUS RADAR'}
        </button>
        <button onClick={() => setSubTab('strategy')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'strategy' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'تعديل الاستراتيجية' : 'STRATEGY'}
        </button>
        <button onClick={() => setSubTab('feedback')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${subTab === 'feedback' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'تدريب الذكاء' : 'TRAINING'}
        </button>
      </div>

      <div className="pt-4">
        {subTab === 'sovereign' && (
          <div className="space-y-12">
             <AutonomousControlCenter 
                strategy={strategy} 
                onDomainsInjected={(newDomains) => setDomains(prev => [...newDomains, ...prev])} 
                lang={lang} 
             />
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <MarketMomentumChart lang={lang} />
                <div className="bg-[#0b0e14] rounded-[40px] p-10 border border-white/5 flex flex-col justify-center items-center text-center space-y-6">
                   <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center text-indigo-500 text-3xl">
                      <i className="fas fa-chart-line"></i>
                   </div>
                   <h3 className="text-xl font-black text-white uppercase">محاكاة القيمة المستقبلية</h3>
                   <p className="text-slate-400 text-sm max-w-sm">
                      يقوم العقل المدبر الآن بمحاكاة عوائد محفظتك بناءً على 12 متغيراً اقتصادياً عالمياً.
                   </p>
                   <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-slate-400 hover:bg-white/10">عرض التقارير التنبؤية</button>
                </div>
             </div>
          </div>
        )}
        {subTab === 'nexus' && (
          <NexusPrimeDashboard 
            lang={lang} 
            addLog={addLog}
            setDomains={setDomains}
          />
        )}
        {subTab === 'strategy' && (
          <MasterBrainDashboard 
            stats={stats} 
            activityLogs={activityLogs} 
            strategy={strategy} 
            setStrategy={setStrategy} 
            lang={lang} 
            // Fixed: Now passing initiate scan and scanning status props
            onInitiateScan={onInitiateScan}
            isScanning={isScanning}
          />
        )}
        {subTab === 'feedback' && (
          <FeedbackDashboard domains={[]} stats={stats} />
        )}
      </div>
    </div>
  );
};

export default IntelligenceHub;
