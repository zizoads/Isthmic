
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Handshake, ShieldAlert, Target, MessageSquare, BrainCircuit, ChevronRight } from 'lucide-react';
import { Domain } from '../types';
import { negotiationLiaison } from '../services/NegotiationAILiaison';
import { useDomainContext } from '../context/DomainContext';

export const TacticalLiaisonHub: React.FC = () => {
  const { domains, addLog } = useDomainContext();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const activeNegotiations = domains.filter(d => d.status === 'negotiating' || d.negotiationThread);

  const handleAnalyze = async (domain: Domain) => {
    if (!domain.negotiationThread) return;
    
    setIsAnalyzing(true);
    setSelectedDomain(domain);
    
    const history = domain.negotiationThread.messages.map(m => `${m.sender}: ${m.content}`).join('\n');
    const lastOffer = domain.price;
    
    const result = await negotiationLiaison.analyzeBuyerMessage(domain.name, history, lastOffer);
    
    if (result) {
      setAnalysisResult(result);
      addLog('Exit Engine', `Tactical analysis complete for ${domain.name}`, 'success');
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Sidebar: Active Negotiations */}
      <div className="lg:col-span-4 space-y-4">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Active Threads
        </h3>
        <div className="space-y-2">
          {activeNegotiations.length > 0 ? (
            activeNegotiations.map(domain => (
              <button
                key={domain.id}
                onClick={() => handleAnalyze(domain)}
                className={`w-full p-4 rounded-2xl border transition-all text-left flex justify-between items-center group ${
                  selectedDomain?.id === domain.id 
                  ? 'bg-white/10 border-indigo-500/50' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{domain.name}</p>
                  <p className="text-[10px] text-white/40 font-mono">${domain.price.toLocaleString()}</p>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedDomain?.id === domain.id ? 'rotate-90 text-indigo-400' : 'text-white/20'}`} />
              </button>
            ))
          ) : (
            <div className="p-8 border border-dashed border-white/10 rounded-2xl text-center">
              <p className="text-xs text-white/20">No active negotiations found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Analysis Area */}
      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {isAnalyzing ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-6 bg-white/5 border border-white/10 rounded-3xl"
            >
              <div className="relative">
                <div className="w-20 h-20 border-2 border-indigo-500/20 rounded-full animate-ping" />
                <BrainCircuit className="absolute inset-0 m-auto w-10 h-10 text-indigo-500 animate-pulse" />
              </div>
              <p className="text-lg font-bold text-white tracking-tighter">Synthesizing Tactical Response...</p>
              <p className="text-xs text-white/40 font-mono">Analyzing psychological markers & leverage points</p>
            </motion.div>
          ) : analysisResult ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Insight Header */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-white tracking-tighter">{selectedDomain?.name}</h2>
                    <span className="px-3 py-1 bg-indigo-500 text-black text-[10px] font-black uppercase rounded-full">
                      {analysisResult.insight.intent.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm italic">"{analysisResult.report.executiveSummary}"</p>
                </div>
                <div className="flex items-center gap-8 border-l border-white/10 pl-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Leverage</p>
                    <p className="text-3xl font-bold text-indigo-400">{analysisResult.report.leverageScore}/100</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-white/30 uppercase mb-1">Sentiment</p>
                    <p className="text-3xl font-bold text-white">{analysisResult.insight.sentimentScore}%</p>
                  </div>
                </div>
              </div>

              {/* Tactical Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Flags */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Risk Assessment
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.report.riskFlags.map((flag: any, i: number) => (
                      <div key={i} className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[10px] font-bold text-red-500 uppercase">{flag.type}</span>
                          <span className="text-[10px] font-bold text-white/40">{flag.severity}</span>
                        </div>
                        <p className="text-xs text-white/70">{flag.evidence}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-500" />
                    Tactical Actions
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.report.recommendedActions.map((action: any, i: number) => (
                      <div key={i} className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl group hover:bg-emerald-500/10 transition-all cursor-pointer">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-white">{action.action}</span>
                          <span className="text-[10px] font-bold text-emerald-500">{action.confidence}%</span>
                        </div>
                        <p className="text-[10px] text-white/40 italic">Outcome: {action.expectedOutcome}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Psychological Markers */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Psychological Markers</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.insight.psychologicalMarkers.map((marker: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-white/60">
                      {marker}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center space-y-4 bg-white/5 border border-white/10 border-dashed rounded-3xl">
              <Handshake className="w-12 h-12 text-white/10" />
              <div className="text-center">
                <p className="text-white/40 font-bold">Tactical Liaison Ready</p>
                <p className="text-white/20 text-xs">Select an active negotiation to initiate AI tactical analysis.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
