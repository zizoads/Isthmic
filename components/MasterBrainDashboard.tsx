
import React, { useState, useEffect } from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  onInitiateScan?: () => void;
  onCancelScan?: () => void;
  isScanning?: boolean;
  onKeyUpdate?: () => void;
}

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, onCancelScan, isScanning, onKeyUpdate }) => {
  const isFirstRun = stats.totalDiscovered === 0;
  const [isKeyConnected, setIsKeyConnected] = useState(false);

  useEffect(() => {
    const checkKey = async () => {
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      setIsKeyConnected(hasKey);
    };
    checkKey();
  }, []);

  const handleConnectKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setIsKeyConnected(true);
    if (onKeyUpdate) onKeyUpdate();
  };

  const updateStrategy = (key: keyof PlatformStrategy, value: any) => {
    setStrategy(prev => ({ ...prev, [key]: value }));
  };

  const requiredSensors = [
    { name: 'رادار المبيعات', icon: 'fa-history', status: 'Grounded' },
    { name: 'صائد الإيميلات', icon: 'fa-envelope-open-text', status: 'Grounded' },
    { name: 'فاحص الحقوق', icon: 'fa-gavel', status: 'Grounded' }
  ];

  return (
    <div className="space-y-12" dir="rtl">
      {/* Sniper Resilience Status */}
      <section className="bg-slate-900 p-10 rounded-[40px] border border-white/10 shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-8">
               <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl ${
                  isKeyConnected ? 'bg-green-500 text-white animate-pulse' : 'bg-amber-500 text-white'
               }`}>
                  <i className={`fas ${isKeyConnected ? 'fa-bolt' : 'fa-triangle-exclamation'}`}></i>
               </div>
               <div className="text-right">
                  <h4 className="text-white font-black text-2xl tracking-tighter uppercase">وضع العملية: {isKeyConnected ? 'هجوم استراتيجي كامل' : 'تحقق أرضي مستقل'}</h4>
                  <p className="text-slate-400 text-sm font-medium mt-1">المنظومة تعمل بكفاءة {isKeyConnected ? '100%' : '75%'} عبر محاكاة البيانات المفقودة.</p>
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
      <section className="bg-white rounded-[50px] border border-indigo-100 shadow-sm p-14">
         <div className="max-w-5xl">
            <div className="flex items-center gap-4 mb-10">
               <div className="w-10 h-2 bg-indigo-600 rounded-full"></div>
               <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase text-right">أطروحة الاستثمار والقيادة (Commander's Intent)</h3>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="lg:col-span-2 space-y-6">
                  <p className="text-sm text-slate-500 font-medium leading-relaxed text-right mb-4">
                    هنا تضع "البوصلة" التي سيسير عليها المستشار. كلما كانت أطروحتك أدق، كان قنصه أسرع.
                  </p>
                  <textarea 
                    value={strategy.investmentThesis || ''}
                    onChange={(e) => updateStrategy('investmentThesis', e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-[32px] px-10 py-8 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 text-right shadow-inner h-48 placeholder:text-slate-300"
                    placeholder="مثال: قنص نطاقات .com المكونة من كلمة واحدة أو كلمتين في قطاع الطاقة النظيفة، بأسعار لا تتجاوز 1000$، مع تاريخ نظيف ومبيعات مشابهة فوق 5000$..."
                  />
               </div>
               
               <div className="space-y-8">
                  <div className="p-8 bg-indigo-50 rounded-[32px] border border-indigo-100 relative overflow-hidden">
                     <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-4 text-right">رأس المال المخصص</label>
                     <div className="flex items-baseline justify-end gap-2 text-3xl font-black text-indigo-700">
                        <input 
                           type="number" 
                           value={strategy.totalBudget}
                           onChange={(e) => updateStrategy('totalBudget', Number(e.target.value))}
                           className="bg-transparent border-none w-full text-right focus:ring-0 p-0"
                        />
                        <span>$</span>
                     </div>
                     <i className="fas fa-vault absolute left-[-10px] bottom-[-10px] text-indigo-600/10 text-6xl"></i>
                  </div>

                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 text-right">نمط الهجوم</label>
                     <select 
                        value={strategy.riskTolerance}
                        onChange={(e) => updateStrategy('riskTolerance', e.target.value)}
                        className="w-full bg-transparent border-none text-right font-black text-slate-900 focus:ring-0 appearance-none cursor-pointer"
                     >
                        <option value="Conservative">محافظ (أمان عالٍ)</option>
                        <option value="Balanced">متوازن (الوضع الافتراضي)</option>
                        <option value="Aggressive">هجومي (فرص عالية المخاطر)</option>
                     </select>
                  </div>
               </div>
            </div>

            <div className="mt-12 flex justify-end gap-6 border-t pt-10">
               {isScanning ? (
                 <button onClick={onCancelScan} className="bg-red-500 text-white px-14 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl">
                   إلغاء المهمة الحالية
                 </button>
               ) : (
                 <button onClick={onInitiateScan} className="bg-indigo-600 text-white px-20 py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-2xl flex items-center gap-4">
                   <i className="fas fa-satellite-dish"></i> تفعيل المنظومة القناصة
                 </button>
               )}
            </div>
         </div>
      </section>

      {/* Analytics & Logs */}
      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} />
           </div>
           <div className="bg-white rounded-[50px] border shadow-sm flex flex-col overflow-hidden h-[650px]">
              <div className="p-10 border-b flex justify-between items-center bg-slate-50/50 text-right">
                 <h3 className="font-black text-slate-800 uppercase text-lg tracking-tighter">سجل ذكاء العمليات</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide text-right">
                 {activityLogs.map(log => (
                    <div key={log.id} className="flex gap-5 border-b border-slate-50 pb-8 justify-end">
                       <p className="text-xs text-slate-700 font-medium leading-relaxed order-1">
                          {log.message}
                          <span className={`font-black uppercase ml-2 ${log.type === 'critical' ? 'text-red-500' : 'text-indigo-600'}`}>:{log.agent}</span>
                       </p>
                       <span className="text-[10px] font-mono text-slate-400 shrink-0 order-2">{log.time}</span>
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
