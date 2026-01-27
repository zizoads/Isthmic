import React, { useState, useEffect } from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';
import { translations } from '../translations';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  onInitiateScan?: () => void;
  onCancelScan?: () => void;
  isScanning?: boolean;
  onKeyUpdate?: () => void;
  lang: 'ar' | 'en';
}

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, lang }) => {
  const t = translations[lang];
  const isFirstRun = stats.totalDiscovered === 0;
  const [isKeyConnected, setIsKeyConnected] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      setIsKeyConnected(hasKey);
    };
    checkKey();
  }, []);

  const handleOpenKeyDialog = async () => {
    try {
      await (window as any).aistudio.openSelectKey();
      setIsKeyConnected(true); // Assume success per race condition guidelines
    } catch (e) {
      console.error("Key selection failed", e);
    }
  };

  const updateStrategy = (key: keyof PlatformStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [key]: value }));
  };

  const requiredSensors = [
    { name: t.radarSales, icon: 'fa-history', status: 'Grounded' },
    { name: t.emailHunter, icon: 'fa-envelope-open-text', status: 'Grounded' },
    { name: t.rightsChecker, icon: 'fa-gavel', status: 'Grounded' }
  ];

  return (
    <div className="space-y-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <section className="bg-slate-900 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-8">
               <button 
                  onClick={handleOpenKeyDialog}
                  className={`w-20 h-20 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl transition-all ${
                  isKeyConnected ? 'bg-green-500 text-white animate-pulse' : 'bg-amber-500 text-white hover:scale-105'
               }`}>
                  <i className={`fas ${isKeyConnected ? 'fa-bolt' : 'fa-key'}`}></i>
               </button>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="text-white font-black text-2xl tracking-tighter uppercase">{t.opsMode}: {isKeyConnected ? t.fullAttack : t.independentAudit}</h4>
                  <p className="text-slate-400 text-sm font-medium mt-1">
                    {t.efficiency} {isKeyConnected ? '100%' : '75%'} • 
                    <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="ml-2 text-indigo-400 hover:underline">
                      {lang === 'ar' ? 'وثائق الفوترة' : 'Billing Docs'}
                    </a>
                  </p>
               </div>
            </div>
            
            <div className="flex gap-4">
               {requiredSensors.map(sensor => (
                 <div key={sensor.name} className="bg-white/5 border border-white/10 px-6 py-4 rounded-3xl flex items-center gap-3">
                    <i className={`fas ${sensor.icon} text-indigo-400 text-sm`}></i>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{sensor.name}</span>
                 </div>
               ))}
            </div>
         </div>
         <i className="fas fa-crosshairs absolute right-[-40px] bottom-[-40px] text-white/5 text-[250px] pointer-events-none"></i>
      </section>

      <section className="bg-background rounded-[50px] border border-border shadow-sm p-14">
         <div className="max-w-5xl">
            <div className={`flex items-center gap-4 mb-10 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
               <div className="w-10 h-2 bg-primary rounded-full"></div>
               <h3 className="text-3xl font-black tracking-tighter uppercase">{t.commanderIntent}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-6">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => updateStrategy('investmentThesis', e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-white/5 border-none rounded-[32px] px-10 py-8 text-sm font-medium focus:ring-4 focus:ring-primary/10 dark:text-white shadow-inner h-48 placeholder:text-slate-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-primary/5 rounded-[32px] border border-primary/20 relative overflow-hidden">
                     <label className={`text-[10px] font-black text-primary uppercase tracking-widest block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.allocatedCapital}</label>
                     <div className={`flex items-baseline gap-2 text-3xl font-black text-primary ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <input 
                           type="number" 
                           value={strategy.totalBudget}
                           onChange={(e) => updateStrategy('totalBudget', Number(e.target.value))}
                           className={`bg-transparent border-none w-full focus:ring-0 p-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                        <span>$</span>
                     </div>
                  </div>

                  <div className="p-8 bg-accent rounded-[32px] border border-border">
                     <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.attackPattern}</label>
                     <select 
                        value={strategy.riskTolerance}
                        onChange={(e) => updateStrategy('riskTolerance', e.target.value)}
                        className={`w-full bg-transparent border-none font-black text-foreground focus:ring-0 appearance-none cursor-pointer ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                     >
                        <option value="Conservative">{t.conservative}</option>
                        <option value="Balanced">{t.balanced}</option>
                        <option value="Aggressive">{t.aggressive}</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className={`mt-12 flex gap-6 border-t border-border pt-10 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500 text-white px-14 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-primary text-primary-foreground px-20 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl flex items-center gap-4">
                   <i className="fas fa-satellite-dish"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>

      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} lang={lang} />
           </div>
           <div className="bg-background rounded-[50px] border border-border shadow-sm flex flex-col overflow-hidden h-[650px]">
              <div className={`p-10 border-b border-border flex justify-between items-center bg-accent ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h3 className="font-black text-foreground uppercase text-lg tracking-tighter">{t.opsLog}</h3>
              </div>
              <div className={`flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 {activityLogs.map(log => (
                    <div key={log.id} className={`flex gap-5 border-b border-border pb-8 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                       <p className={`text-xs text-slate-500 font-medium leading-relaxed ${lang === 'ar' ? 'order-1' : 'order-2'}`}>
                          {log.message}
                          <span className={`font-black uppercase ${lang === 'ar' ? 'ml-2' : 'mr-2'} ${log.type === 'critical' ? 'text-red-500' : 'text-primary'}`}>:{log.agent}</span>
                       </p>
                       <span className={`text-[10px] font-mono text-slate-400 shrink-0 ${lang === 'ar' ? 'order-2' : 'order-1'}`}>{log.time}</span>
                    </div>
                 ))}
                 {activityLogs.length === 0 && <div className="text-center py-20 opacity-20">{t.opsLogEmpty}</div>}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterBrainDashboard;