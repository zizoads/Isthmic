
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
  const engine = new MasterBrainEngine(() => {});

  const handleAnalyze = async (domain: Domain) => {
    setAnalyzingId(domain.id);
    const buyerMessage = "The price is too high for our budget, but we like the brand.";
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
    <div className="space-y-12 animate-fade-in pb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
             {lang === 'ar' ? 'الأصول قيد التفاوض' : 'NEGOTIATION PIPELINE'}
           </h3>
           {negotiatingDomains.map(d => (
             <div 
                key={d.id} 
                onClick={() => handleAnalyze(d)}
                className={`p-8 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden glass-card
                  ${d.status === 'negotiating' ? 'border-indigo-500/50 bg-indigo-500/5 shadow-2xl shadow-indigo-500/10' : 'border-white/5'}`}
             >
                <div className="flex justify-between items-start mb-4">
                   <div>
                      <h4 className="text-xl font-black text-white italic">{d.name}</h4>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{d.sector}</span>
                   </div>
                   <div className="text-right">
                      <div className="text-lg font-black text-white">${d.price.toLocaleString()}</div>
                      <div className="text-[8px] font-bold text-slate-500 uppercase">Target Exit</div>
                   </div>
                </div>
                {d.battleCard && (
                  <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                     <div className="text-center">
                        <div className="text-lg font-black text-green-500">{d.battleCard.closingProbability}%</div>
                        <div className="text-[7px] font-black uppercase text-slate-500">Confidence</div>
                     </div>
                     <div className="h-8 w-[1px] bg-white/10"></div>
                     <div className="text-center">
                        <div className="text-lg font-black text-indigo-400">{d.battleCard.sentimentScore}/10</div>
                        <div className="text-[7px] font-black uppercase text-slate-500">EQ Score</div>
                     </div>
                  </div>
                )}
                {analyzingId === d.id && (
                  <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center animate-fade-in">
                     <i className="fas fa-brain fa-spin text-white text-2xl"></i>
                  </div>
                )}
             </div>
           ))}
        </div>

        <div className="lg:col-span-8">
           {negotiatingDomains.find(d => d.battleCard) ? (
             <div className="space-y-10 animate-slide-up">
                <div className="glass-panel rounded-[40px] p-12 relative overflow-hidden">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">STRATEGIC BATTLE CARD</h3>
                      <span className="px-4 py-1.5 bg-green-500/10 text-green-500 text-[10px] font-black rounded-full border border-green-500/20">SENTIMENT: RECEPTIVE</span>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-8">
                         <div>
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-3">Buyer Psychology</label>
                            <p className="text-xl text-white font-medium italic border-r-4 border-indigo-500 pr-6 leading-relaxed">
                               "{negotiatingDomains.find(d => d.battleCard)?.battleCard?.buyerMotive}"
                            </p>
                         </div>
                         <div className="space-y-4">
                            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Tactical Leverage</label>
                            {negotiatingDomains.find(d => d.battleCard)?.battleCard?.leveragePoints.map((pt, i) => (
                              <div key={i} className="flex items-center gap-4 text-xs font-bold text-slate-300 bg-white/2 p-3 rounded-xl border border-white/5">
                                 <i className="fas fa-bolt text-indigo-500 text-[10px]"></i> {pt}
                              </div>
                            ))}
                         </div>
                      </div>

                      <div className="bg-[#0b0e14]/50 rounded-[32px] p-10 flex flex-col justify-between border border-white/10 shadow-inner">
                         <div className="text-center">
                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Recommended Counter-Offer</span>
                            <div className="text-5xl font-black text-white mt-4 tracking-tighter">$ {negotiatingDomains.find(d => d.battleCard)?.battleCard?.suggestedCounter.toLocaleString()}</div>
                            <div className="text-[10px] text-green-500 font-bold mt-2 uppercase">Alpha Margin: +42%</div>
                         </div>
                         <div className="space-y-4 pt-10">
                            <button 
                               onClick={() => handleGenerateContract(negotiatingDomains.find(d => d.battleCard)!)}
                               className="w-full py-5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl"
                            >
                               Generate Final Term Sheet
                            </button>
                            <button className="w-full py-5 bg-white/5 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
                               Tactical Withdrawal (Hold)
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                {termSheet && (
                  <div className="glass-panel rounded-[40px] p-12 shadow-2xl animate-fade-in border-indigo-500/20">
                     <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                        <h4 className="text-xl font-black text-white uppercase italic tracking-tighter">LEGAL CLOSING PROTOCOL</h4>
                        <button onClick={() => setTermSheet(null)} className="text-slate-500 hover:text-red-500"><i className="fas fa-times"></i></button>
                     </div>
                     <pre className="text-[11px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap bg-black/40 p-10 rounded-3xl h-[400px] overflow-y-auto border border-white/5 italic custom-scrollbar">
                        {termSheet}
                     </pre>
                     <div className="mt-10 flex gap-6">
                        <button className="flex-1 py-5 bg-green-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-green-900/10">Execute Sovereign Transfer</button>
                        <button className="px-10 py-5 border border-white/10 text-slate-400 rounded-2xl text-[11px] font-black uppercase hover:bg-white/5 transition-all">Download PDF</button>
                     </div>
                  </div>
                )}
             </div>
           ) : (
             <div className="h-[600px] flex flex-col items-center justify-center glass-panel rounded-[40px] text-slate-700">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                   <i className="fas fa-handshake-slash text-5xl opacity-20"></i>
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Selection for EQ Analysis</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default NegotiationDashboard;
