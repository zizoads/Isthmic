
import React, { useState } from 'react';
import { Domain } from '../types';
import { analyzeNegotiationTacticsAI, generateClosingTermSheetAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [negotiations, setNegotiations] = useState([
    {
      id: '1',
      domain: 'quantum-agents.com',
      lastReply: 'We are looking for a domain for our new stealth startup. Your $15k is high. We can offer $4k for a quick close today.',
      buyerName: 'Stealth Ventures',
      currentAsk: 15000,
      analysis: null as any,
      termSheet: null as string | null
    }
  ]);

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleDeepAnalysis = async (negId: string) => {
    const neg = negotiations.find(n => n.id === negId);
    if (!neg) return;
    setAnalyzingId(negId);
    
    const result = await analyzeNegotiationTacticsAI(neg.lastReply, neg.domain, neg.currentAsk);
    
    setNegotiations(prev => prev.map(n => n.id === negId ? { ...n, analysis: result } : n));
    setAnalyzingId(null);
  };

  const handleGenerateTermSheet = async (neg: any) => {
    setAnalyzingId(neg.id);
    const doc = await generateClosingTermSheetAI(neg.domain, neg.analysis?.suggestedCounter || neg.currentAsk, neg.buyerName);
    setNegotiations(prev => prev.map(n => n.id === neg.id ? { ...n, termSheet: doc } : n));
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {negotiations.map(neg => (
          <div key={neg.id} className="bg-white rounded-[40px] border shadow-sm overflow-hidden flex flex-col hover:shadow-2xl transition-all border-slate-100">
            <div className="p-10 border-b flex justify-between items-center bg-slate-50/30">
              <div>
                <h4 className="font-black text-slate-900 text-2xl tracking-tighter uppercase">{neg.domain}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Lead: {neg.buyerName}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase">Opening Ask</span>
                <span className="text-xl font-black text-slate-900">${neg.currentAsk.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-10 space-y-10">
              <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative group">
                <div className="text-[10px] text-slate-400 font-black uppercase mb-4 tracking-widest flex items-center gap-2">
                  <i className="fas fa-inbox"></i> Incoming Transmission
                </div>
                <p className="text-sm italic text-slate-700 leading-relaxed font-medium">"{neg.lastReply}"</p>
                <button 
                  onClick={() => handleDeepAnalysis(neg.id)}
                  disabled={analyzingId === neg.id}
                  className="absolute bottom-[-20px] right-8 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl"
                >
                  {analyzingId === neg.id ? <i className="fas fa-brain fa-spin"></i> : 'Run Tactical Analysis'}
                </button>
              </div>

              {neg.analysis && (
                <div className="space-y-8 animate-slide-up mt-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                       <div className="text-[8px] font-black text-indigo-400 uppercase mb-1">Buyer Profile</div>
                       <div className="text-xs font-black text-indigo-900">{neg.analysis.buyerType}</div>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                       <div className="text-[8px] font-black text-amber-500 uppercase mb-1">Urgency</div>
                       <div className="text-xs font-black text-amber-900">{neg.analysis.urgency}</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
                       <div className="text-[8px] font-black text-green-500 uppercase mb-1">Closing Prob.</div>
                       <div className="text-xs font-black text-green-900">{neg.analysis.sentimentScore}/10</div>
                    </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex justify-between items-center mb-6">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">Suggested Counter-Strike</h5>
                          <span className="text-2xl font-black">${neg.analysis.suggestedCounter.toLocaleString()}</span>
                       </div>
                       <p className="text-xs leading-relaxed opacity-90 italic mb-8 border-l-2 border-white/20 pl-4">
                         "{neg.analysis.tacticalResponse}"
                       </p>
                       <div className="flex gap-3">
                          <button className="flex-1 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">Send Counter</button>
                          <button 
                            onClick={() => handleGenerateTermSheet(neg)}
                            className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-400 hover:bg-indigo-400 transition-all"
                          >
                            Draft Term Sheet
                          </button>
                       </div>
                    </div>
                    <i className="fas fa-chess-knight absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px]"></i>
                  </div>
                </div>
              )}

              {neg.termSheet && (
                <div className="bg-slate-900 text-white p-8 rounded-[32px] animate-fade-in border border-slate-800">
                   <div className="flex justify-between items-center mb-6">
                      <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Escrow Readiness: Term Sheet</h5>
                      <button className="text-[10px] text-slate-400 hover:text-white uppercase font-black tracking-widest">Copy Doc</button>
                   </div>
                   <div className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed max-h-[200px] overflow-y-auto scrollbar-hide">
                      {neg.termSheet}
                   </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NegotiationDashboard;
