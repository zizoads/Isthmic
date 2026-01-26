
import React from 'react';
import { Domain } from '../types';

interface Props {
  domain: Domain;
  onClose: () => void;
}

const AgentReasoningLab: React.FC<Props> = ({ domain, onClose }) => {
  return (
    <div className="fixed inset-y-0 left-0 w-[450px] bg-[#0d1117] text-white shadow-2xl z-50 border-r border-white/10 flex flex-col animate-slide-left font-mono" dir="rtl">
      <header className="p-8 border-b border-white/5 flex justify-between items-center">
         <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all">
            <i className="fas fa-times text-xs"></i>
         </button>
         <div className="text-right">
            <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Agentic Observability</h3>
            <div className="font-bold text-lg tracking-tight">{domain.name}</div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
         <section>
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">سلسلة التفكير (Chain of Thought)</h4>
            <div className="space-y-4 text-xs leading-relaxed text-slate-400 italic">
               {domain.thinkingPath ? (
                  domain.thinkingPath.split('.').map((p, i) => (
                    p.trim() && (
                      <div key={i} className="flex gap-4 border-r border-indigo-500/30 pr-4 py-1">
                         <span className="text-indigo-500 font-black">0{i+1}</span>
                         <p>{p.trim()}.</p>
                      </div>
                    )
                  ))
               ) : (
                  <div className="p-6 bg-white/5 rounded-2xl text-center opacity-30">لا توجد بيانات استدلال متاحة حالياً.</div>
               )}
            </div>
         </section>

         <section className="bg-white/5 p-6 rounded-3xl border border-white/10 space-y-4">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">المعايير التقنية المستخلصة</h4>
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Liquidity Score</div>
                  <div className="text-xl font-black">{domain.technicalMetrics?.liquidityScore || 0}/10</div>
               </div>
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Confidence</div>
                  <div className="text-xl font-black">{(domain.probability || 0) * 100}%</div>
               </div>
            </div>
         </section>

         <section>
            <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">سجل الأحداث الخام (Raw Logs)</h4>
            <div className="bg-black/40 rounded-2xl p-6 text-[9px] text-green-400/80 space-y-2 overflow-hidden">
               <p><span className="text-slate-600">[{new Date().toISOString()}]</span> REQUEST_SENT: gemini-3-pro-preview</p>
               <p><span className="text-slate-600">[{new Date().toISOString()}]</span> TOOL_CALL: googleSearch({ JSON.stringify({ q: domain.name + ' appraised value' }) })</p>
               <p><span className="text-slate-600">[{new Date().toISOString()}]</span> REASONING_ENGINE_ACTIVE: parsing_competitors...</p>
               <p><span className="text-slate-600">[{new Date().toISOString()}]</span> RESPONSE_RECEIVED: 200 OK</p>
               <div className="pt-2 text-indigo-400 animate-pulse underline cursor-pointer">View full JSON payload</div>
            </div>
         </section>
      </div>

      <footer className="p-8 border-t border-white/5 bg-white/2 flex justify-between items-center">
         <span className="text-[9px] font-black text-slate-500 uppercase">Agent Version 2.5.4</span>
         <button className="bg-indigo-600 px-6 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-white hover:text-indigo-600 transition-all">
            إعادة محاكاة القرار
         </button>
      </footer>
    </div>
  );
};

export default AgentReasoningLab;
