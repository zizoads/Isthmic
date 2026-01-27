
import React, { useState, useEffect } from 'react';
import { Domain } from '../types';
import { debateDomainStrategyAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  domain: Domain;
  onClose: () => void;
  lang: 'ar' | 'en';
}

const AgentReasoningLab: React.FC<Props> = ({ domain, onClose, lang }) => {
  const [debateData, setDebateData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = translations[lang];

  useEffect(() => {
    const fetchDebate = async () => {
      setIsLoading(true);
      try {
        const data = await debateDomainStrategyAI(domain.name, lang);
        setDebateData(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDebate();
  }, [domain.name, lang]);

  return (
    <div className="fixed inset-y-0 right-0 w-full lg:w-[800px] bg-[#05070a] text-white shadow-[0_0_100px_rgba(0,0,0,0.8)] z-[400] border-l border-white/10 flex flex-col animate-slide-left font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-[#08090d]/80 backdrop-blur-xl sticky top-0 z-10">
         <div className="flex items-center gap-6">
            <button onClick={onClose} className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all border border-white/5 flex items-center justify-center">
               <i className="fas fa-times"></i>
            </button>
            <div>
               <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">{lang === 'ar' ? 'مختبر الاستدلال السيادي' : 'SOVEREIGN REASONING LAB'}</h3>
               <div className="text-2xl font-black text-white italic">{domain.name}</div>
            </div>
         </div>
         <div className="text-right">
            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{lang === 'ar' ? 'معرف العملية' : 'OP_ID'}</div>
            <div className="text-xs font-mono text-indigo-500">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar">
         {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                  <i className="fas fa-brain absolute inset-0 flex items-center justify-center text-indigo-500 text-3xl animate-pulse"></i>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
                  {lang === 'ar' ? 'جاري عقد مناظرة بين وكلاء الذكاء الاصطناعي...' : 'CONVENING MULTI-AGENT STRATEGY DEBATE...'}
               </p>
            </div>
         ) : debateData && (
            <div className="space-y-12 animate-fade-in">
               {/* Debate Section */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl relative overflow-hidden group">
                     <div className="flex items-center gap-3 mb-6">
                        <i className="fas fa-chart-line text-indigo-500"></i>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{lang === 'ar' ? 'منظور خبير الاستراتيجية' : 'STRATEGIST VIEW'}</h4>
                     </div>
                     <p className="text-xs text-slate-300 leading-relaxed italic border-r-2 border-indigo-500/30 pr-4">
                        "{debateData.strategistView}"
                     </p>
                  </div>

                  <div className="p-8 bg-red-500/5 border border-red-500/10 rounded-3xl relative overflow-hidden group">
                     <div className="flex items-center gap-3 mb-6">
                        <i className="fas fa-shield-halved text-red-500"></i>
                        <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">{lang === 'ar' ? 'منظور خبير التدقيق' : 'AUDITOR VIEW'}</h4>
                     </div>
                     <p className="text-xs text-slate-300 leading-relaxed italic border-r-2 border-red-500/30 pr-4">
                        "{debateData.auditorView}"
                     </p>
                  </div>
               </div>

               {/* Risk & Confidence Meter */}
               <div className="bg-[#0b0e14] p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
                  <div className="flex-1 space-y-4 w-full">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{lang === 'ar' ? 'تقييم المخاطر الجنائي' : 'FORENSIC RISK SCORE'}</span>
                        <span className={`text-2xl font-black ${debateData.riskScore > 70 ? 'text-red-500' : 'text-green-500'}`}>{debateData.riskScore}%</span>
                     </div>
                     <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-1000 ${debateData.riskScore > 70 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${debateData.riskScore}%` }}></div>
                     </div>
                  </div>
                  <div className="w-px h-16 bg-white/5 hidden md:block"></div>
                  <div className="text-center md:text-right">
                     <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">{lang === 'ar' ? 'قرار العقل المدبر' : 'MASTERMIND VERDICT'}</div>
                     <div className="text-sm font-black text-white italic underline decoration-indigo-500 underline-offset-8">
                        {debateData.riskScore < 40 ? (lang === 'ar' ? 'استحواذ قسري فوري' : 'IMMEDIATE ACQUISITION') : (lang === 'ar' ? 'مراقبة حذرة' : 'WATCHFUL MONITORING')}
                     </div>
                  </div>
               </div>

               {/* Comparable Sales */}
               <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                     <i className="fas fa-history"></i> {lang === 'ar' ? 'مبيعات مقارنة موثقة (Market Comps)' : 'GROUNDED MARKET COMPS'}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     {debateData.comparableSales?.map((comp: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-5 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all">
                           <span className="text-xs font-bold text-slate-300">{comp.domain}</span>
                           <span className="text-sm font-black text-indigo-400 tabular-nums">${comp.price.toLocaleString()}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Summary Verdict */}
               <div className="p-10 bg-indigo-600 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                  <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-6">{lang === 'ar' ? 'المذكرة التنفيذية النهائية' : 'FINAL EXECUTIVE MEMO'}</h4>
                  <p className="text-xl font-medium leading-relaxed italic">
                     "{debateData.finalVerdict}"
                  </p>
                  <i className="fas fa-signature absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px]"></i>
               </div>
            </div>
         )}
      </div>

      <footer className="p-8 border-t border-white/5 bg-[#08090d] flex justify-between items-center sticky bottom-0 z-10">
         <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <i className="fas fa-network-wired text-indigo-500 animate-pulse"></i>
            {lang === 'ar' ? 'النظام متصل بمصادر البحث الموثقة' : 'CONNECTED TO SEARCH GROUNDING'}
         </div>
         <button 
            disabled={isLoading}
            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl disabled:opacity-50"
         >
            {lang === 'ar' ? 'تأكيد وحقن الاستراتيجية' : 'CONFIRM & INJECT STRATEGY'}
         </button>
      </footer>
    </div>
  );
};

export default AgentReasoningLab;
