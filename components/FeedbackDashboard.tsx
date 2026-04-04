import React, { useState } from 'react';
import { Domain, PlatformStats } from '../types';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
}

const FeedbackDashboard: React.FC<Props> = () => {
  const [trainingData, setTrainingData] = useState([
    { id: '1', domain: 'solar-cloud-tech.com', decision: 'Suggest Purchase', reason: 'High search volume in renewable sector with strong TLD synergy.', status: 'pending' },
    { id: '2', domain: 'pizza-fast-delivery.com', decision: 'Ignore', reason: 'Too generic, high competition, low resale liquidity index.', status: 'pending' },
    { id: '3', domain: 'quantum-link.io', decision: 'Strategic Snipe', reason: 'Rising momentum in tech-security niche; backlink profile verified.', status: 'pending' }
  ]);

  const handleFeedback = (id: string, isCorrect: boolean) => {
    setTrainingData(prev => prev.map(t => t.id === id ? { ...t, status: isCorrect ? 'approved' : 'rejected' } : t));
  };

  return (
    <div className="space-y-8 animate-precision">
      <div className="bg-indigo-900/20 rounded-[40px] p-10 text-white relative overflow-hidden border border-indigo-500/20">
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-1.5 bg-indigo-500 text-white text-[9px] font-black rounded-full uppercase tracking-widest">Neural Laboratory</div>
            <h2 className="text-4xl lg:text-5xl prestige-heading italic">AI Training Center</h2>
            <p className="text-indigo-200/60 leading-relaxed max-w-xl text-sm italic">
              Your agents learn from every choice you make. Review the autonomous decisions below to calibrate their neural weights and improve future viability predictions.
            </p>
            <div className="flex gap-6 pt-4">
              <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[9px] font-black uppercase text-indigo-400 mb-1">Learning Yield</div>
                <div className="text-3xl font-black text-white italic">94.2%</div>
              </div>
              <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-[9px] font-black uppercase text-indigo-400 mb-1">Logic Blocks</div>
                <div className="text-3xl font-black text-white italic">1.4k</div>
              </div>
            </div>
          </div>
          <div className="w-56 h-56 rounded-full border-[10px] border-indigo-500/10 flex items-center justify-center relative shadow-2xl bg-indigo-500/5 group">
             <div className="text-center group-hover:scale-110 transition-transform duration-700">
               <div className="text-5xl font-black italic text-white">94%</div>
               <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-2">Confidence</div>
             </div>
             <div className="absolute -top-4 bg-green-500 text-black text-[9px] px-4 py-1.5 rounded-full font-black uppercase tracking-widest shadow-lg animate-pulse">Fine Tuning</div>
          </div>
        </div>
        <i className="fas fa-graduation-cap absolute right-[-40px] bottom-[-40px] text-white/[0.02] text-[200px] -rotate-12 pointer-events-none"></i>
      </div>

      <div className="bg-black/40 border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
          <h3 className="font-bold text-white uppercase tracking-tighter text-xs italic">Recent AI Logic Trials</h3>
          <div className="flex items-center gap-3">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Learning Active</span>
          </div>
        </div>
        <div className="divide-y divide-white/5">
          {trainingData.map(item => (
            <div key={item.id} className={`p-10 flex flex-col md:flex-row gap-10 items-start transition-all ${item.status !== 'pending' ? 'opacity-30 grayscale blur-[1px]' : 'hover:bg-white/[0.01]'}`}>
              <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 text-2xl border border-white/10 group-hover:border-indigo-500 transition-all">
                <i className="fas fa-robot"></i>
              </div>
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-6">
                  <h4 className="text-2xl font-black text-white italic tracking-tighter">{item.domain}</h4>
                  <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black rounded-xl uppercase border border-indigo-500/20">
                    Decision: {item.decision}
                  </span>
                </div>
                <p className="text-base text-slate-400 leading-relaxed italic border-l-2 border-indigo-500/20 pl-8">
                  "{item.reason}"
                </p>
              </div>
              {item.status === 'pending' ? (
                <div className="flex gap-3">
                  <button 
                    onClick={() => handleFeedback(item.id, true)}
                    className="w-14 h-14 bg-white/5 text-green-500 rounded-2xl hover:bg-green-500 hover:text-black transition-all border border-white/10"
                    title="Validate Decision"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button 
                    onClick={() => handleFeedback(item.id, false)}
                    className="w-14 h-14 bg-white/5 text-red-500 rounded-2xl hover:bg-red-500 hover:text-black transition-all border border-white/10"
                    title="Reject Logic"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/5 px-6 py-4 rounded-xl border border-white/5">
                  Knowledge Secured
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;