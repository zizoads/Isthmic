
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

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, onKeyUpdate, lang }) => {
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
      {/* Sniper Resilience Status */}
      <section className="bg-slate-900 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-8">
               <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl ${
                  isKeyConnected ? 'bg-green-500 text-white animate-pulse' : 'bg-amber-500 text-white'
               }`}>
                  <i className={`fas ${isKeyConnected ? 'fa-bolt' : 'fa-triangle-exclamation'}`}></i>
               </div>
               <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                  <h4 className="text-white font-black text-2xl tracking-tighter uppercase">{t.opsMode}: {isKeyConnected ? t.fullAttack : t.independentAudit}</h4>
                  <p className="text-slate-400 text-sm font-medium mt-1">{t.efficiency} {isKeyConnected ? '100%' : '75%'}</p>
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

      {/* Commander's Intent Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[50px] border border-indigo-100 dark:border-white/5 shadow-sm p-14">
         <div className="max-w-5xl">
            <div className={`flex items-center gap-4 mb-10 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
               <div className="w-10 h-2 bg-indigo-600 rounded-full"></div>
               <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t.commanderIntent}</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-6">
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => updateStrategy('investmentThesis', e.target.value)}
                    className={`w-full bg-slate-50 dark:bg-white/5 border-none rounded-[32px] px-10 py-8 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 dark:text-white shadow-inner h-48 placeholder:text-slate-300 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                    placeholder={t.thesisPlaceholder}
                  />
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-indigo-50 dark:bg-indigo-900/20 rounded-[32px] border border-indigo-100 dark:border-indigo-500/20 relative overflow-hidden">
                     <label className={`text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.allocatedCapital}</label>
                     <div className={`flex items-baseline gap-2 text-3xl font-black text-indigo-700 dark:text-indigo-400 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <input 
                           type="number" 
                           value={strategy.totalBudget}
                           onChange={(e) => updateStrategy('totalBudget', Number(e.target.value))}
                           className={`bg-transparent border-none w-full focus:ring-0 p-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                        />
                        <span>$</span>
                     </div>
                  </div>

                  <div className="p-8 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5">
                     <label className={`text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.attackPattern}</label>
                     <select 
                        value={strategy.riskTolerance}
                        onChange={(e) => updateStrategy('riskTolerance', e.target.value)}
                        className={`w-full bg-transparent border-none font-black text-slate-900 dark:text-white focus:ring-0 appearance-none cursor-pointer ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                     >
                        <option value="Conservative">{t.conservative}</option>
                        <option value="Balanced">{t.balanced}</option>
                        <option value="Aggressive">{t.aggressive}</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className={`mt-12 flex gap-6 border-t dark:border-white/5 pt-10 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500 text-white px-14 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">
                   {t.cancelMission}
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-indigo-600 text-white px-20 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl flex items-center gap-4">
                   <i className="fas fa-satellite-dish"></i> {t.activateSniper}
                 </button>
               )}
            </div>
         </div>
      </section>

      {/* Logs */}
      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} />
           </div>
           <div className="bg-white dark:bg-slate-900 rounded-[50px] border dark:border-white/5 shadow-sm flex flex-col overflow-hidden h-[650px]">
              <div className={`p-10 border-b dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/5 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <h3 className="font-black text-slate-800 dark:text-white uppercase text-lg tracking-tighter">{t.opsLog}</h3>
              </div>
              <div className={`flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 {activityLogs.map(log => (
                    <div key={log.id} className={`flex gap-5 border-b dark:border-white/5 pb-8 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                       <p className={`text-xs text-slate-700 dark:text-slate-400 font-medium leading-relaxed ${lang === 'ar' ? 'order-1' : 'order-2'}`}>
                          {log.message}
                          <span className={`font-black uppercase ${lang === 'ar' ? 'ml-2' : 'mr-2'} ${log.type === 'critical' ? 'text-red-500' : 'text-indigo-600'}`}>:{log.agent}</span>
                       </p>
                       <span className={`text-[10px] font-mono text-slate-400 shrink-0 ${lang === 'ar' ? 'order-2' : 'order-1'}`}>{log.time}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MasterBrainDashboard;
