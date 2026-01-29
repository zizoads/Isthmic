
import React, { useState, useEffect } from 'react';
import { Domain } from '../types';
import { debateDomainStrategyAI } from '../services/geminiService';

const ViewCard: React.FC<{ role: string; text: string; color: string; icon: string }> = ({ role, text, color, icon }) => (
  <div className={`p-8 bg-${color}-500/5 border border-${color}-500/10 rounded-3xl`}>
    <div className="flex items-center gap-3 mb-6">
      <i className={`fas ${icon} text-${color}-500`}></i>
      <h4 className={`text-[10px] font-black text-${color}-400 uppercase tracking-widest`}>{role}</h4>
    </div>
    <p className="text-xs text-slate-300 leading-relaxed italic border-r-2 pr-4" style={{ borderColor: `var(--${color}-500)` }}>
      "{text}"
    </p>
  </div>
);

const RiskMeter: React.FC<{ score: number; lang: string }> = ({ score, lang }) => (
  <div className="bg-[#0b0e14] p-10 rounded-[40px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
    <div className="flex-1 space-y-4 w-full">
      <div className="flex justify-between mb-2">
        <span className="text-[10px] font-black text-slate-500 uppercase">{lang === 'ar' ? 'تقييم المخاطر' : 'RISK SCORE'}</span>
        <span className={`text-2xl font-black ${score > 70 ? 'text-red-500' : 'text-green-500'}`}>{score}%</span>
      </div>
      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${score > 70 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  </div>
);

const AgentReasoningLab: React.FC<{ domain: Domain; onClose: () => void; lang: 'ar' | 'en' }> = ({ domain, onClose, lang }) => {
  const [debate, setDebate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    debateDomainStrategyAI(domain.name, lang).then(data => {
      if (active) { setDebate(data); setLoading(false); }
    });
    return () => { active = false; };
  }, [domain.name, lang]);

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-y-0 right-0 w-full lg:w-[800px] bg-[#05070a] text-white shadow-2xl z-[400] border-l border-white/10 flex flex-col animate-slide-left font-mono">
      <header className="p-8 border-b border-white/5 flex justify-between items-center bg-[#08090d]/80 backdrop-blur-xl">
        <div className="flex items-center gap-6">
          <button onClick={onClose} role="button" aria-label="Close" className="w-10 h-10 rounded-xl bg-white/5 hover:bg-red-500/20 flex items-center justify-center transition-all">
            <i className="fas fa-times"></i>
          </button>
          <div>
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">REASONING_LAB_V4</h3>
            <div className="text-2xl font-black italic">{domain.name}</div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12 custom-scrollbar">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <i className="fas fa-brain fa-spin text-indigo-500 text-3xl mb-4"></i>
            <p className="text-[10px] font-black text-slate-400 uppercase animate-pulse">Syncing multi-agent logic...</p>
          </div>
        ) : debate && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ViewCard role="STRATEGIST" text={debate.strategistView} color="indigo" icon="fa-chart-line" />
              <ViewCard role="AUDITOR" text={debate.auditorView} color="red" icon="fa-shield-halved" />
            </div>
            <RiskMeter score={debate.riskScore} lang={lang} />
            <div className="p-10 bg-indigo-600 rounded-[40px] text-white relative overflow-hidden">
               <h4 className="text-[10px] font-black uppercase mb-6">Final Executive Verdict</h4>
               <p className="text-xl font-medium italic">"{debate.finalVerdict}"</p>
               <i className="fas fa-signature absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px]"></i>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentReasoningLab;
