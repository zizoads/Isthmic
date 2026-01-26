
import React, { useState } from 'react';
import { Domain } from '../types';
import { suggestNegotiationCounter } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [negotiations, setNegotiations] = useState([
    {
      id: '1',
      domain: 'fintech-logic.com',
      lastReply: 'I am interested, but $5000 is too much. Can you do $1200?',
      sentiment: 'Interested / Low Ball',
      suggestedCounter: 3500,
      responseText: "I appreciate your offer. Given the strategic value of this domain in the fintech space, $1200 is below its market value. I can meet you at $3500 for a quick closing.",
      strategy: "Meet in the middle",
      status: 'waiting_approval'
    }
  ]);

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleAIAnalysis = async (negId: string) => {
    const neg = negotiations.find(n => n.id === negId);
    if (!neg) return;
    setAnalyzingId(negId);
    
    const result = await suggestNegotiationCounter(neg.lastReply, 5000); // 5000 is mock current ask
    if (result) {
      setNegotiations(prev => prev.map(n => n.id === negId ? {
        ...n,
        suggestedCounter: result.suggestedCounter,
        responseText: result.responseText,
        sentiment: result.sentiment,
        strategy: result.strategy
      } : n));
    }
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {negotiations.map(neg => (
          <div key={neg.id} className="bg-white rounded-2xl border shadow-sm flex flex-col overflow-hidden hover:shadow-md transition-all">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border rounded-xl flex items-center justify-center text-indigo-600 shadow-sm">
                  <i className="fas fa-comment-dots"></i>
                </div>
                <div>
                  <h4 className="font-black text-slate-800">{neg.domain}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600 uppercase">
                      {neg.sentiment}
                    </span>
                  </div>
                </div>
              </div>
              <button onClick={() => handleAIAnalysis(neg.id)} className="text-indigo-600 hover:text-indigo-800 p-2">
                {analyzingId === neg.id ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-sync-alt"></i>}
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative">
                <div className="text-[10px] text-slate-400 font-black uppercase mb-3">Customer Inquiry</div>
                <p className="text-sm italic text-slate-700 leading-relaxed font-medium">"{neg.lastReply}"</p>
              </div>

              <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-[10px] font-black uppercase text-indigo-200 tracking-widest">AI Suggested Response</div>
                  <div className="bg-white/20 px-2 py-1 rounded text-[10px] font-bold">Strategy: {neg.strategy}</div>
                </div>
                <p className="text-xs leading-relaxed opacity-90 mb-4 italic">"{neg.responseText}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <div>
                    <div className="text-[10px] uppercase opacity-60 font-bold">Counter Offer</div>
                    <div className="text-xl font-black">${neg.suggestedCounter}</div>
                  </div>
                  <button className="bg-white text-indigo-600 px-6 py-2 rounded-xl font-black text-xs hover:bg-slate-100 transition-all">
                    Approve & Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NegotiationDashboard;
