
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

  const externalTools = [
    { name: 'Gmail', icon: 'fab fa-google text-red-500', desc: 'المراسلة الاستراتيجية', url: 'https://mail.google.com' },
    { name: 'NameBio', icon: 'fas fa-history text-slate-400', desc: 'تحليل المبيعات التاريخية', url: 'https://namebio.com' },
    { name: 'Hunter API', icon: 'fas fa-envelope-open-text text-orange-500', desc: 'استخراج البريد الرسمي', url: 'https://hunter.io' },
    { name: 'Escrow', icon: 'fas fa-shield-halved text-green-600', desc: 'تأمين الصفقات الضخمة', url: 'https://escrow.com' }
  ];

  return (
    <div className="space-y-12" dir="rtl">
      {/* Real-time Status & Key Management */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-indigo-900 rounded-[32px] p-6 text-white shadow-xl relative overflow-hidden group col-span-1 md:col-span-1">
           <div className="relative z-10">
              <div className="text-[10px] font-black uppercase text-indigo-300 mb-2">Enterprise API Connector</div>
              <h4 className="text-lg font-black mb-4">{isKeyConnected ? 'Connected' : 'Community Mode'}</h4>
              <button 
                onClick={handleConnectKey}
                className="w-full bg-white text-indigo-900 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <i className={`fas ${isKeyConnected ? 'fa-sync' : 'fa-plug'}`}></i>
                {isKeyConnected ? 'Switch Pro Key' : 'Connect Pro Key'}
              </button>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="block text-center text-[8px] text-indigo-300 mt-4 underline opacity-70 hover:opacity-100"
              >
                Learn about billing and project keys
              </a>
           </div>
           <i className="fas fa-key absolute right-[-20px] bottom-[-20px] text-white/5 text-[100px]"></i>
        </div>

        {externalTools.map(tool => (
          <button 
            key={tool.name}
            onClick={() => window.open(tool.url, '_blank')}
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-500 hover:shadow-xl transition-all flex items-center gap-5 text-right group"
          >
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 shadow-inner">
              <i className={`${tool.icon} text-xl`}></i>
            </div>
            <div>
              <div className="text-xs font-black text-slate-900 uppercase tracking-tight">{tool.name}</div>
              <div className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-1">{tool.desc}</div>
            </div>
          </button>
        ))}
      </section>

      {/* Operation Parameters */}
      <section className="bg-white rounded-[50px] border shadow-sm p-12 relative overflow-hidden border-indigo-100/50">
        <div className="relative z-10">
           <div className="flex justify-between items-center mb-12">
              <div className="text-right">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">مركز العمليات المالية</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">توجيه الذكاء الاصطناعي نحو أهدافك الاستثمارية</p>
              </div>
              <div className="bg-indigo-600/5 border border-indigo-600/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                 <div className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">النظام مراقب بالذكاء الاصطناعي</span>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              {[
                { label: 'ميزانية الاستثمار', key: 'totalBudget', type: 'number', placeholder: '$ 25,000' },
                { label: 'العائد المستهدف (%)', key: 'targetROI', type: 'number', placeholder: '500%' },
                { label: 'تحمل المخاطرة', key: 'riskTolerance', type: 'select', options: ['Conservative', 'Balanced', 'Aggressive'] },
                { label: 'الامتدادات المطلوبة', key: 'targetTLDs', type: 'multi' }
              ].map((field) => (
                <div key={field.key} className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right block">{field.label}</label>
                  {field.type === 'number' ? (
                    <input 
                      type="number" 
                      value={strategy[field.key as keyof PlatformStrategy] as number}
                      onChange={(e) => updateStrategy(field.key as keyof PlatformStrategy, Number(e.target.value))}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-indigo-500/20 text-right shadow-inner"
                      placeholder={field.placeholder}
                    />
                  ) : field.type === 'select' ? (
                    <select 
                      value={strategy[field.key as keyof PlatformStrategy] as string}
                      onChange={(e) => updateStrategy(field.key as keyof PlatformStrategy, e.target.value)}
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-black focus:ring-2 focus:ring-indigo-500/20 text-right shadow-inner appearance-none"
                    >
                      {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <div className="flex gap-2 justify-end flex-wrap">
                      {['.com', '.ai', '.io', '.net'].map(tld => (
                        <button 
                          key={tld}
                          onClick={() => {
                            const newTlds = strategy.targetTLDs.includes(tld) 
                              ? strategy.targetTLDs.filter(t => t !== tld)
                              : [...strategy.targetTLDs, tld];
                            updateStrategy('targetTLDs', newTlds);
                          }}
                          className={`px-4 py-2.5 rounded-xl text-[10px] font-black transition-all border ${
                            strategy.targetTLDs.includes(tld) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100'
                          }`}
                        >
                          {tld}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
           </div>
        </div>
        <div className="absolute right-[-30px] bottom-[-30px] opacity-[0.03] text-[250px] pointer-events-none">
           <i className="fas fa-coins"></i>
        </div>
      </section>

      {/* Main Dash or Onboarding */}
      {isFirstRun ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
           <div className="bg-slate-900 p-12 rounded-[50px] text-white flex flex-col justify-between text-right border border-white/5 relative overflow-hidden group hover:shadow-2xl transition-all">
              <div className="relative z-10">
                <span className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-xs font-black mb-8 shadow-lg">01</span>
                <h4 className="text-2xl font-black mb-4">هندسة الاستراتيجية</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">ابدأ بضبط حدودك المالية وقواعد التشغيل الذاتي في الأعلى.</p>
              </div>
              <i className="fas fa-sliders-h text-7xl mt-12 text-white opacity-5 self-start group-hover:scale-110 transition-transform"></i>
           </div>
           
           <div className="bg-white p-12 rounded-[50px] border border-indigo-50 flex flex-col justify-between shadow-xl shadow-indigo-100/10 text-right group hover:border-indigo-500 transition-all">
              <div className="relative z-10">
                <span className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xs font-black mb-8 shadow-lg">02</span>
                <h4 className="text-2xl font-black text-slate-900 mb-4">حقن البيانات</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">قم بتحميل محفظتك الحالية أو ابدأ بالبحث عن أصول جديدة في السوق الثانوي.</p>
              </div>
              <i className="fas fa-database text-7xl mt-12 text-slate-100 self-start group-hover:scale-110 transition-transform"></i>
           </div>

           <div className="bg-indigo-600 p-12 rounded-[50px] text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 text-right group relative overflow-hidden">
              <div className="relative z-10">
                <span className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center text-xs font-black mb-8 shadow-lg">03</span>
                <h4 className="text-2xl font-black mb-4">تفعيل المسح العميق</h4>
                <p className="text-indigo-100 text-sm leading-relaxed font-medium">اضغط "بدء المسح" لربط المنصة ببيانات السوق الحية والبحث عن فرص.</p>
              </div>
              
              {isScanning ? (
                <button onClick={onCancelScan} className="mt-12 bg-red-500 text-white py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl flex items-center justify-center gap-3 relative z-10">
                  <i className="fas fa-stop-circle animate-pulse"></i> إجهاض المهمة فوراً
                </button>
              ) : (
                <button onClick={onInitiateScan} className="mt-12 bg-white text-indigo-600 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl relative z-10">
                  إطلاق محرك البحث الحي
                </button>
              )}
              <i className="fas fa-satellite-dish absolute left-[-20px] bottom-[-20px] text-white/10 text-[180px]"></i>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <div className="lg:col-span-2">
              <AnalyticsDashboard stats={stats} />
           </div>
           <div className="bg-white rounded-[50px] border shadow-sm flex flex-col overflow-hidden h-[600px]">
              <div className="p-10 border-b flex justify-between items-center bg-slate-50/50 text-right">
                 <h3 className="font-black text-slate-800 uppercase text-lg tracking-tighter">سجل استخبارات المهمة</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-hide text-right">
                 {activityLogs.map(log => (
                    <div key={log.id} className="flex gap-5 border-b border-slate-50 pb-6 justify-end">
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
