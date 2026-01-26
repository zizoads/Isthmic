
import React, { useState } from 'react';
import { Domain, PlatformStats } from '../types';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
}

const FeedbackDashboard: React.FC<Props> = ({ domains, stats }) => {
  const [trainingData, setTrainingData] = useState([
    { id: '1', domain: 'solar-cloud-tech.com', decision: 'Suggest Purchase', reason: 'High search volume in renewable sector', status: 'pending' },
    { id: '2', domain: 'pizza-fast-delivery.com', decision: 'Ignore', reason: 'Too generic, low resale value', status: 'pending' }
  ]);

  const handleFeedback = (id: string, isCorrect: boolean) => {
    setTrainingData(prev => prev.map(t => t.id === id ? { ...t, status: isCorrect ? 'approved' : 'rejected' } : t));
  };

  return (
    <div className="space-y-8">
      <div className="bg-indigo-900 rounded-2xl p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-black tracking-tighter">AI Training Center</h2>
            <p className="text-indigo-200 leading-relaxed max-w-xl">
              Your agents learn from every choice you make. Review the autonomous decisions below to calibrate their neural weights.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                <div className="text-[10px] font-black uppercase text-indigo-300">Learning Accuracy</div>
                <div className="text-2xl font-black">94.2%</div>
              </div>
              <div className="px-6 py-3 bg-white/10 rounded-2xl border border-white/10">
                <div className="text-[10px] font-black uppercase text-indigo-300">Decisions Evaluated</div>
                <div className="text-2xl font-black">1.4k</div>
              </div>
            </div>
          </div>
          <div className="w-48 h-48 rounded-full border-[12px] border-indigo-800 flex items-center justify-center relative shadow-2xl">
             <div className="text-center">
               <div className="text-4xl font-black">94%</div>
               <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Confidence</div>
             </div>
             <div className="absolute -top-4 bg-green-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest shadow-lg">Optimizing</div>
          </div>
        </div>
        <div className="absolute right-[-20px] bottom-[-20px] text-white/5 text-[180px] -rotate-12">
          <i className="fas fa-graduation-cap"></i>
        </div>
      </div>

      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 uppercase tracking-tighter text-sm">Recent AI Logic Trials</h3>
          <span className="text-[10px] font-black text-slate-400 uppercase">Training Mode: Enabled</span>
        </div>
        <div className="divide-y">
          {trainingData.map(item => (
            <div key={item.id} className={`p-8 flex flex-col md:flex-row gap-8 items-start transition-all ${item.status !== 'pending' ? 'opacity-40 grayscale' : ''}`}>
              <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                <i className="fas fa-robot text-xl"></i>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4">
                  <h4 className="text-lg font-black text-slate-800">{item.domain}</h4>
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full uppercase">
                    Decision: {item.decision}
                  </span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  "Reasoning: {item.reason}"
                </p>
              </div>
              {item.status === 'pending' ? (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleFeedback(item.id, true)}
                    className="w-12 h-12 bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm"
                  >
                    <i className="fas fa-check"></i>
                  </button>
                  <button 
                    onClick={() => handleFeedback(item.id, false)}
                    className="w-12 h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              ) : (
                <div className="text-xs font-black uppercase tracking-widest text-slate-400 py-3">
                  Training Logged
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
