
import React, { useState, useRef, useMemo } from 'react';
import { Domain, StrategicObjective } from '../../types';
import { rigorousDiscoveryAI } from '../../services/geminiService';
import { useDomainContext } from '../../context/DomainContext';
import { useSovereignT } from '../../hooks/useTranslation';
import PrestigeLoader from './PrestigeLoader';
import { OrchestrationService } from '../../services/ai/OrchestrationService';

interface Props {
  domains: Domain[];
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
  objectives?: StrategicObjective[];
}

const DiscoveryDashboard: React.FC<Props> = ({ addLog, objectives = [] }) => {
  const t = useSovereignT();
  const { activeProfile, stats, addDomain } = useDomainContext();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [filterElite, setFilterElite] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    setIsSearching(true);
    setScannedResults([]);
    abortControllerRef.current = new AbortController();
    
    addLog('Discovery', 'Initiating goal-oriented market mining...', 'info');

    try {
      const response = await rigorousDiscoveryAI(
        prompt, 
        'en', 
        abortControllerRef.current.signal, 
        objectives,
        [] // Removed strategy.causalRejectionModels
      );
      
      const predictedResults = await Promise.all(response.data.map(async (item: any) => {
        const prediction = await OrchestrationService.predictAssetViability(item.name, []);
        return { 
          ...item, 
          predictiveViabilityScore: prediction.viability,
          causalPenaltyReason: prediction.penaltyReason
        };
      }));

      setScannedResults(predictedResults);
      addLog('Discovery', `Sweep complete. Adaptive Filter: ${stats.adaptiveThreshold}%`, 'success', { latency: response.latency });
    } catch (e: any) {
      if (e.message !== 'Aborted') addLog('System', 'Inference pipeline interrupted.', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    const threshold = stats.adaptiveThreshold || 80;
    if (filterElite) return scannedResults.filter(r => (r.strategicAlignmentScore || 0) >= threshold);
    return scannedResults;
  }, [scannedResults, filterElite, stats.adaptiveThreshold]);

  return (
    <div className="space-y-10 animate-prestige" dir="ltr">

      <div className="glass-panel p-8 lg:p-10 space-y-8 relative overflow-hidden group">
        <header className="space-y-3 relative z-10">
           <div className="flex justify-between items-center">
             <span className="text-[#d4af37] text-[8px] font-black uppercase tracking-[0.4em] flex items-center gap-2">
                <i className="fas fa-brain animate-pulse text-[10px]"></i> Goal-Oriented Discovery
             </span>
             <div className="flex items-center gap-2">
                <span className="text-[7px] font-black text-slate-500 uppercase">Filter: {stats.adaptiveThreshold}%</span>
                <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
             </div>
           </div>
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder={t('searchPlaceholder')}
             className="w-full bg-transparent border-none text-xl lg:text-2xl prestige-title outline-none min-h-[100px] text-white placeholder:text-white/10 italic leading-tight p-0 resize-none"
           />
        </header>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 relative z-10">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-[#d4af37] text-base">
                <i className="fas fa-microchip"></i>
              </div>
              <div className="text-[7px] font-black text-slate-500 uppercase leading-tight tracking-widest">
                Feedback_Control: CAUSAL<br/>Sync_Status: {objectives.length > 0 ? 'LOCKED' : 'IDLE'}
              </div>
           </div>

           <button 
              onClick={handleSearch} 
              disabled={isSearching || !prompt} 
              className="prestige-btn prestige-btn-gold !px-8 !py-3 !text-[9px]"
            >
              {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
              <span>{isSearching ? 'ALIGNING...' : t('startInference')}</span>
            </button>
        </div>
      </div>

      {isSearching && <PrestigeLoader label="Applying causal filters..." />}

      {scannedResults.length > 0 && !isSearching && (
        <div className="space-y-6 animate-prestige">
           <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-4 gap-4">
              <div className="space-y-1">
                 <h3 className="prestige-title text-2xl text-white italic">Discovery Manifest.</h3>
                 <p className="text-[7px] text-slate-600 font-bold uppercase tracking-widest">Dynamic Threshold: {stats.adaptiveThreshold}%</p>
              </div>
              <button 
                onClick={() => setFilterElite(!filterElite)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all ${filterElite ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-slate-500'}`}
              >
                <i className="fas fa-crown text-[7px]"></i>
                <span className="text-[8px] font-black uppercase tracking-widest">ADAPTIVE FILTER</span>
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.map((r, i) => (
                <div key={i} className={`square-card p-6 group relative overflow-hidden flex flex-col justify-between h-[360px] ${r.causalPenaltyReason ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                         <div className="text-xl font-black text-white group-hover:text-[#d4af37] transition-colors leading-none italic truncate max-w-[70%]">{r.name}</div>
                         <div className="text-right">
                            <div className="text-[10px] font-mono font-black text-[#d4af37] mb-1">${r.estimatedPrice}</div>
                            <div className={`text-[7px] font-black uppercase px-2 py-0.5 rounded ${r.strategicAlignmentScore >= stats.adaptiveThreshold ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-slate-500'}`}>
                               {r.strategicAlignmentScore}%
                            </div>
                         </div>
                      </div>
                      
                      <div className="mb-4 p-2 bg-white/2 border border-white/5 rounded-lg">
                         <div className="flex justify-between text-[7px] font-black uppercase text-slate-600 mb-1">
                            <span>Neural Prediction</span>
                            <span className={r.predictiveViabilityScore > 70 ? 'text-green-500' : 'text-amber-500'}>{r.predictiveViabilityScore}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${r.predictiveViabilityScore > 70 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${r.predictiveViabilityScore}%` }}></div>
                         </div>
                      </div>

                      {r.trafficSignal && r.trafficSignal !== 'none' && (
                        <div className="mb-4 flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                           <i className="fas fa-chart-line text-indigo-400 text-[10px]"></i>
                           <div className="flex-1">
                              <div className="flex justify-between items-center">
                                 <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">Traffic Signal: {r.trafficSignal}</span>
                                 <span className="text-[6px] font-bold text-white/30 uppercase">{r.trafficSource}</span>
                              </div>
                           </div>
                        </div>
                      )}

                      <p className="text-[11px] text-slate-500 font-medium mb-6 italic leading-relaxed h-16 overflow-hidden line-clamp-3 border-l border-white/5 pl-4">
                        "{r.justification}"
                      </p>
                   </div>
                   
                   <div className="pt-4 border-t border-white/5 flex justify-between items-center relative z-10">
                      <div className="space-y-0.5">
                        <div className="text-[7px] font-black uppercase text-slate-700 tracking-widest">Confidence</div>
                        <div className="text-lg font-mono font-black text-white">{Math.round(r.probability * 100)}%</div>
                      </div>
                      <button 
                        onClick={() => activeProfile && addDomain({ id: crypto.randomUUID(), ...r, status: 'available' })} 
                        className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black hover:bg-[#d4af37] transition-all shadow-lg hover:scale-105"
                      >
                        <i className="fas fa-plus text-xs"></i>
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryDashboard;
