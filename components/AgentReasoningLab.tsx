
import React from 'react';
import { Domain, AgentRole } from '../types';

interface Props {
  domain: Domain;
  onClose: () => void;
}

const AgentReasoningLab: React.FC<Props> = ({ domain, onClose }) => {
  const getRoleIcon = (role: AgentRole) => {
    switch (role) {
      case AgentRole.ANALYZER: return 'fa-brain';
      case AgentRole.EXECUTOR: return 'fa-microchip';
      case AgentRole.AUDITOR: return 'fa-shield-check';
    }
  };

  const getRoleColor = (role: AgentRole) => {
    switch (role) {
      case AgentRole.ANALYZER: return 'text-purple-400';
      case AgentRole.EXECUTOR: return 'text-blue-400';
      case AgentRole.AUDITOR: return 'text-green-400';
    }
  };

  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[550px] bg-[#0b0e14] text-white shadow-2xl z-[300] border-r border-white/10 flex flex-col animate-slide-left font-sans" dir="rtl">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
         <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all">
            <i className="fas fa-times text-xs"></i>
         </button>
         <div className="text-right">
            <h3 className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">غرفة التفكير المتعدد الأدوار</h3>
            <div className="font-bold text-xl tracking-tight">{domain.name}</div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
         <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">سلسلة الاستدلال الجماعي (Collaborative CoT)</h4>
            
            <div className="space-y-8">
               {domain.agentThoughts ? (
                 domain.agentThoughts.map((thought, i) => (
                   <div key={i} className={`relative p-6 rounded-3xl border border-white/5 bg-white/2 animate-fade-in`}>
                      <div className="flex justify-between items-center mb-4">
                         <span className="text-[9px] font-mono text-slate-500">{thought.timestamp}</span>
                         <div className={`flex items-center gap-2 ${getRoleColor(thought.role)}`}>
                            <span className="text-[10px] font-black uppercase tracking-widest">{thought.role}</span>
                            <i className={`fas ${getRoleIcon(thought.role)}`}></i>
                         </div>
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                         {thought.message}
                      </p>
                      {thought.status === 'thinking' && (
                        <div className="mt-4 flex gap-1">
                           <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></div>
                           <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.1s]"></div>
                           <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.2s]"></div>
                        </div>
                      )}
                   </div>
                 ))
               ) : (
                 <div className="flex flex-col items-center justify-center py-20 opacity-20 space-y-4">
                    <i className="fas fa-microchip text-6xl"></i>
                    <p className="text-[10px] uppercase font-black tracking-widest">Awaiting multi-agent debate...</p>
                 </div>
               )}
            </div>
         </section>

         <section className="bg-indigo-600/5 p-8 rounded-[32px] border border-indigo-500/10 space-y-6">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">المؤشرات الفنية (Verified by Auditor)</h4>
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Trust Probability</div>
                  <div className="text-2xl font-black text-white">{(domain.probability ? domain.probability * 100 : 0).toFixed(1)}%</div>
               </div>
               <div className="space-y-1">
                  <div className="text-[8px] text-slate-500 uppercase">Market Resilience</div>
                  <div className="text-2xl font-black text-white">{domain.technicalMetrics?.liquidityScore || '--'}</div>
               </div>
            </div>
         </section>
      </div>

      <footer className="p-8 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase">Multi-Agent Consensus Active</span>
         </div>
         <button onClick={() => window.print()} className="bg-white/5 px-6 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all">
            تصدير سجل التفكير
         </button>
      </footer>
    </div>
  );
};

export default AgentReasoningLab;
