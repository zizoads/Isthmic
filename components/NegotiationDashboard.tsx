
import React, { useState } from 'react';
import { Domain, NegotiationBattleCard } from '../types';
import { MasterBrainEngine } from '../services/masterBrainEngine';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const [termSheet, setTermSheet] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'leads' | 'archive'>('leads');

  const engine = new MasterBrainEngine(() => {});

  const handleAnalyze = async (domain: Domain) => {
    setAnalyzingId(domain.id);
    const buyerMessage = "This price is too high, we can offer $2,000 for a quick sale."; // Simulated buyer reply
    const card = await engine.analyzeNegotiation(domain.name, buyerMessage);
    
    setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, battleCard: card, status: 'negotiating' } : d));
    setAnalyzingId(null);
  };

  const handleGenerateContract = async (domain: Domain) => {
    const contract = await engine.generateTermSheet(domain);
    setTermSheet(contract);
  };

  const negotiatingDomains = domains.filter(d => d.status === 'negotiating' || d.status === 'purchased').slice(0, 4);

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
         <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">غرفة المفاوضات السيادية</h2>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.4em] mt-2">SOVEREIGN WAR ROOM • LIVE OPERATIONS</p>
         </div>
         <div className="flex gap-4">
            <div className="text-right">
               <div className="text-[10px] font-black text-indigo-400 uppercase">قيمة المفاوضات النشطة</div>
               <div className="text-2xl font-black text-white">$42,500</div>
            </div>
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Active Negotiations List */}
        <div className="lg:col-span-4 space-y-6 overflow-y-auto max-h-[800px] scrollbar-hide">
           {negotiatingDomains.map(d => (
             <div 
                key={d.id} 
                onClick={() => handleAnalyze(d)}
                className={`p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${
                  d.status === 'negotiating' ? 'bg-indigo-600 border-indigo-400 shadow-2xl' : 'bg-[#0b0e14] border-white/5 hover:border-indigo-500/50'
                }`}
             >
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="text-xl font-black text-white truncate max-w-[180px]">{d.name}</h4>
                      <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">{d.sector}</span>
                   </div>
                   <div className="text-right">
                      <div className="text-xs font-black text-white">$ {d.price.toLocaleString()}</div>
                      <div className="text-[8px] font-bold text-slate-400">Current Ask</div>
                   </div>
                </div>
                {d.battleCard && (
                  <div className="mt-6 flex justify-between items-center bg-black/20 p-4 rounded-2xl">
                     <div className="text-center">
                        <div className="text-lg font-black text-green-400">{d.battleCard.closingProbability}%</div>
                        <div className="text-[7px] font-black uppercase text-indigo-200">Prob.</div>
                     </div>
                     <div className="h-8 w-[1px] bg-white/10"></div>
                     <div className="text-center">
                        <div className="text-lg font-black text-white">{d.battleCard.sentimentScore}/10</div>
                        <div className="text-[7px] font-black uppercase text-indigo-200">Sentiment</div>
                     </div>
                  </div>
                )}
                {analyzingId === d.id && (
                  <div className="absolute inset-0 bg-indigo-600/90 flex items-center justify-center animate-fade-in">
                     <i className="fas fa-brain fa-spin text-white text-2xl"></i>
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Battle Card & Action Console */}
        <div className="lg:col-span-8 space-y-8">
           {negotiatingDomains.find(d => d.battleCard) ? (
             <div className="animate-slide-up space-y-10">
                <div className="bg-[#0b0e14] border border-white/10 rounded-[50px] p-12 shadow-2xl relative overflow-hidden">
                   <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-10">بطاقة معركة المشتري (Buyer Battle Card)</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                      <div className="space-y-10">
                         <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">نمط المشتري والدوافع</label>
                            <p className="text-xl text-white font-medium italic border-r-4 border-indigo-500 pr-6 leading-relaxed">
                               "{negotiatingDomains.find(d => d.battleCard)?.battleCard?.buyerMotive}"
                            </p>
                         </div>
                         <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-4">نقاط الضغط (Leverage Points)</label>
                            <div className="space-y-3">
                               {negotiatingDomains.find(d => d.battleCard)?.battleCard?.leveragePoints.map((pt, i) => (
                                 <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300">
                                    <i className="fas fa-bolt text-indigo-500 text-[10px]"></i> {pt}
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                      <div className="bg-white/5 rounded-[40px] p-10 flex flex-col justify-between border border-white/5">
                         <div className="text-center">
                            <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">العرض المضاد المقترح</span>
                            <div className="text-5xl font-black text-white mt-4">$ {negotiatingDomains.find(d => d.battleCard)?.battleCard?.suggestedCounter.toLocaleString()}</div>
                         </div>
                         <div className="space-y-4">
                            <button 
                               onClick={() => handleGenerateContract(negotiatingDomains.find(d => d.battleCard)!)}
                               className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl"
                            >
                               إرسال مسودة الإغلاق (Term Sheet)
                            </button>
                            <button className="w-full py-5 bg-white/5 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                               رفض العرض وانسحاب تكتيكي
                            </button>
                         </div>
                      </div>
                   </div>
                   <i className="fas fa-handshake absolute right-[-50px] bottom-[-50px] text-white/5 text-[280px] pointer-events-none -rotate-12"></i>
                </div>

                {termSheet && (
                  <div className="bg-white rounded-[50px] p-12 shadow-2xl animate-fade-in">
                     <div className="flex justify-between items-center mb-10 border-b pb-6">
                        <h4 className="text-xl font-black text-slate-900 uppercase italic">مسودة الإغلاق القانونية</h4>
                        <button onClick={() => setTermSheet(null)} className="text-slate-400 hover:text-red-500"><i className="fas fa-times"></i></button>
                     </div>
                     <pre className="text-xs font-mono text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-8 rounded-3xl h-[400px] overflow-y-auto border border-slate-100 italic">
                        {termSheet}
                     </pre>
                     <div className="mt-8 flex gap-4">
                        <button className="flex-1 py-5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all">توقيع وإرسال العقد</button>
                        <button className="px-8 py-5 border-2 border-slate-200 text-slate-400 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-100">تحميل PDF</button>
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="h-[600px] flex flex-col items-center justify-center bg-[#0b0e14] border border-white/5 rounded-[50px] text-slate-700">
                <i className="fas fa-comments-dollar text-8xl mb-8 opacity-10"></i>
                <p className="text-sm font-black uppercase tracking-[0.4em]">بانتظار اختيار مفاوضة نشطة لتحليلها...</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NegotiationDashboard;
