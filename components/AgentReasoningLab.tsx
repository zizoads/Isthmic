
import React from 'react';
import { Domain, AgentRole } from '../types';
import HardROICalculator from './HardROICalculator';
import ForensicScanner from './ForensicScanner';

interface Props {
  domain: Domain;
  onClose: () => void;
}

const AgentReasoningLab: React.FC<Props> = ({ domain, onClose }) => {
  return (
    <div className="fixed inset-y-0 left-0 w-full sm:w-[650px] bg-[#05070a] text-white shadow-2xl z-[300] border-r border-white/10 flex flex-col animate-slide-left font-mono" dir="rtl">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
         <button onClick={onClose} className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-red-500 transition-all">
            <i className="fas fa-times text-xs"></i>
         </button>
         <div className="text-right">
            <h3 className="text-red-500 font-black text-[10px] uppercase tracking-[0.3em]">تحليل قرار الاستحواذ القسري</h3>
            <div className="font-bold text-2xl tracking-tighter uppercase text-white">{domain.name}</div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
         {/* Economic Logic */}
         <section className="grid grid-cols-1 gap-6">
            <HardROICalculator domain={domain} lang="ar" />
            <ForensicScanner domain={domain} lang="ar" />
         </section>

         {/* Chain of Thought: Direct & Goal-Oriented */}
         <section className="space-y-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">سلسلة الاستدلال التنفيذية</h4>
            <div className="space-y-4">
               {domain.agentThoughts?.map((thought, i) => (
                 <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-xl border-r-4 border-indigo-500">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] font-black text-indigo-400 uppercase">{thought.role}</span>
                       <span className="text-[9px] text-slate-600">{thought.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-bold italic">
                       "{thought.message}"
                    </p>
                 </div>
               ))}
            </div>
         </section>
      </div>

      <footer className="p-6 border-t border-white/5 bg-slate-900/50 flex justify-between items-center">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Decision Matrix Locked</span>
         </div>
         <button className="bg-green-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-green-900/20 hover:bg-green-500 transition-all">
            تنفيذ الاستحواذ الفوري
         </button>
      </footer>
    </div>
  );
};

export default AgentReasoningLab;
