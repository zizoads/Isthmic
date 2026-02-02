
import React, { useState, useRef, useMemo } from 'react';
import { Domain, StrategicObjective } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';
import { useDomainContext } from '../context/DomainContext';
import { useSovereignT } from '../hooks/useTranslation';
import PricingTerminal from './PricingTerminal';
import PrestigeLoader from './ui/PrestigeLoader';
import { OrchestrationService } from '../services/ai/OrchestrationService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
  objectives?: StrategicObjective[];
}

const DiscoveryDashboard: React.FC<Props> = ({ setDomains, addLog, lang, objectives = [] }) => {
  const t = useSovereignT(lang);
  const { activeProfile, trackUsage, strategy, stats } = useDomainContext();
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [showPricing, setShowPricing] = useState(false);
  const [filterElite, setFilterElite] = useState(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    setIsSearching(true);
    setScannedResults([]);
    abortControllerRef.current = new AbortController();
    
    addLog('Discovery', lang === 'ar' ? 'بدء تنقيب السوق الاستراتيجي الموجه...' : 'Initiating goal-oriented market mining...', 'info');

    try {
      const response = await rigorousDiscoveryAI(
        prompt, 
        lang, 
        abortControllerRef.current.signal, 
        objectives,
        strategy.causalRejectionModels // استخدام الذاكرة السببية
      );
      
      await trackUsage('scan');
      
      // Stage 4: حقن التنبؤ الاستباقي لكل نتيجة
      const predictedResults = await Promise.all(response.data.map(async (item: any) => {
        const prediction = await OrchestrationService.predictAssetViability(item.name, strategy.causalRejectionModels || []);
        return { 
          ...item, 
          predictiveViabilityScore: prediction.viability,
          causalPenaltyReason: prediction.penaltyReason
        };
      }));

      setScannedResults(predictedResults);
      addLog('Discovery', `Sweep complete. Adaptive Filter: ${stats.adaptiveThreshold}%`, 'success');
    } catch (e: any) {
      if (e.message !== 'Aborted') addLog('System', 'Inference pipeline interrupted.', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  const filteredResults = useMemo(() => {
    // Stage 4: تطبيق العتبة التكيفية الديناميكية بدلاً من 80% ثابتة
    const threshold = strategy.adaptiveThresholdEnabled ? stats.adaptiveThreshold : 80;
    if (filterElite) return scannedResults.filter(r => (r.strategicAlignmentScore || 0) >= threshold);
    return scannedResults;
  }, [scannedResults, filterElite, stats.adaptiveThreshold, strategy.adaptiveThresholdEnabled]);

  return (
    <div className="space-y-16 animate-prestige" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {showPricing && <PricingTerminal onClose={() => setShowPricing(false)} lang={lang} />}

      <div className="glass-panel p-16 lg:p-24 space-y-16 relative overflow-hidden group">
        <header className="space-y-6 relative z-10">
           <div className="flex justify-between items-center">
             <span className="text-[#d4af37] text-[10px] font-black uppercase tracking-[0.5em] flex items-center gap-4">
                <i className="fas fa-brain animate-pulse"></i> Goal-Oriented Discovery
             </span>
             <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                   <span className="text-[9px] font-black text-slate-500 uppercase">Adaptive Filter: {stats.adaptiveThreshold}%</span>
                   <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-widest">Stage 4 Active</span>
                </div>
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1]"></div>
             </div>
           </div>
           <textarea
             value={prompt}
             onChange={(e) => setPrompt(e.target.value)}
             placeholder={t('searchPlaceholder')}
             className="w-full bg-transparent border-none text-4xl lg:text-6xl prestige-title outline-none min-h-[180px] text-white placeholder:text-white/5 italic leading-tight p-0 resize-none"
           />
        </header>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5 relative z-10">
           <div className="flex items-center gap-8">
              <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[30px] flex items-center justify-center text-[#d4af37] text-3xl shadow-2xl transition-all group-hover:scale-110">
                <i className="fas fa-microchip"></i>
              </div>
              <div className="text-[9px] font-black text-slate-500 uppercase leading-loose tracking-[0.2em]">
                Feedback_Control: CAUSAL<br/>Objective_Lock: {objectives.length > 0 ? 'SYNCHRONIZED' : 'IDLE'}
              </div>
           </div>

           <button 
              onClick={handleSearch} 
              disabled={isSearching || !prompt} 
              className="prestige-btn prestige-btn-gold !px-20 !py-7"
            >
              {isSearching ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-bolt"></i>}
              <span>{isSearching ? 'ALIGNING...' : t('startInference')}</span>
            </button>
        </div>
      </div>

      {isSearching && <PrestigeLoader label="Applying causal filters and predictive modeling..." />}

      {scannedResults.length > 0 && !isSearching && (
        <div className="space-y-12 animate-prestige">
           <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/5 pb-10 gap-6">
              <div className="space-y-2">
                 <h3 className="prestige-title text-5xl text-white italic">Discovery Manifest.</h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase">Dynamic Threshold: {stats.adaptiveThreshold}%</p>
              </div>
              <div className="flex items-center gap-6">
                 <button 
                  onClick={() => setFilterElite(!filterElite)}
                  className={`flex items-center gap-3 px-6 py-2.5 rounded-full border transition-all ${filterElite ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-slate-400'}`}
                 >
                    <i className="fas fa-crown text-[10px]"></i>
                    <span className="text-[9px] font-black uppercase tracking-widest">
                       {lang === 'ar' ? 'تصفية ذكية' : 'ADAPTIVE FILTER'}
                    </span>
                 </button>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredResults.map((r, i) => (
                <div key={i} className={`square-card p-12 group relative overflow-hidden flex flex-col justify-between h-[480px] ${r.causalPenaltyReason ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                         <div className="text-3xl font-black text-white group-hover:text-[#d4af37] transition-colors leading-none italic">{r.name}</div>
                         <div className="text-right">
                            <div className="text-sm font-mono font-black text-[#d4af37] mb-1">${r.estimatedPrice}</div>
                            <div className={`text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-sm ${r.strategicAlignmentScore >= stats.adaptiveThreshold ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white/5 text-slate-500'}`}>
                               Match: {r.strategicAlignmentScore}%
                            </div>
                         </div>
                      </div>
                      
                      <div className="mb-8 p-4 bg-white/2 border border-white/5 rounded-2xl">
                         <div className="flex justify-between text-[8px] font-black uppercase text-slate-500 mb-2">
                            <span>Neural Prediction</span>
                            <span className={r.predictiveViabilityScore > 70 ? 'text-green-500' : 'text-amber-500'}>{r.predictiveViabilityScore}%</span>
                         </div>
                         <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${r.predictiveViabilityScore > 70 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${r.predictiveViabilityScore}%` }}></div>
                         </div>
                      </div>

                      <p className="text-sm text-slate-400 font-medium mb-12 italic leading-relaxed h-28 overflow-hidden line-clamp-4 border-l-2 border-white/5 pl-8">
                        "{r.justification}"
                      </p>
                      
                      {r.causalPenaltyReason && (
                        <div className="text-[9px] font-bold text-red-400 italic mb-4">
                           // Penalty: {r.causalPenaltyReason}
                        </div>
                      )}
                   </div>
                   
                   <div className="pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                      <div className="space-y-2">
                        <div className="text-[9px] font-black uppercase text-slate-600 tracking-widest">Confidence Alpha</div>
                        <div className="text-2xl font-mono font-black text-white">{Math.round(r.probability * 100)}%</div>
                      </div>
                      <button 
                        onClick={() => activeProfile && setDomains(p => [{ id: crypto.randomUUID(), ...r, status: 'available' }, ...p])} 
                        className="w-14 h-14 bg-white rounded-3xl flex items-center justify-center text-black hover:bg-[#c5a059] transition-all shadow-2xl hover:scale-110"
                      >
                        <i className="fas fa-plus text-lg"></i>
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
