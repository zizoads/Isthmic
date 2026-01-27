
import React, { useState, useRef } from 'react';
import { Domain, DomainFinancials } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const t = translations[lang];
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    
    setIsSearching(true);
    setScannedResults([]);
    abortControllerRef.current = new AbortController();
    
    addLog('Discovery Agent', lang === 'ar' ? 'بدء تنقيب السوق الاستراتيجي...' : 'Initiating strategic market mining...');

    try {
      const results = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal);
      setScannedResults(results);
      addLog('Discovery Agent', lang === 'ar' ? `اكتمل التنقيب. تم العثور على ${results.length} فرصة.` : `Mining complete. Found ${results.length} opportunities.`, 'success');
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('aborted')) {
        addLog('System', t.processAborted, 'warning');
      } else {
        addLog('System', lang === 'ar' ? 'خطأ في الاتصال بالمحرك.' : 'Engine communication error.', 'critical');
      }
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsSearching(false);
    }
  };

  const addAllToPipeline = () => {
    const formatted: Domain[] = scannedResults.map(r => {
      const acq = r.estimatedPrice || 250;
      const target = r.targetExitPrice || acq * 10;
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: r.name,
        price: acq,
        status: 'available',
        contentStatus: 'none',
        lastChecked: new Date().toISOString(),
        sector: r.name.split('.')[0],
        justification: r.justification,
        probability: r.probability || 0.5,
        financials: {
          acquisitionCost: acq,
          holdingCostPerYear: 15,
          targetExitPrice: target,
          projectedROI: Math.round(((target - acq) / acq) * 100),
          netProfit: target - acq,
          platformFees: Math.round(target * 0.15),
          escrowFees: Math.round(target * 0.03),
          liquidityScore: Math.round((r.probability || 0.5) * 100),
          alphaScore: r.alphaScore || 50
        }
      };
    });
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
  };

  return (
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        <div className={`relative glass-card rounded-[40px] p-2 border border-white/10 ${isSearching ? 'scanning-effect kill-switch-active' : ''}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full bg-transparent text-white px-10 py-10 text-xl font-medium outline-none transition-all min-h-[220px] scrollbar-hide ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className={`absolute bottom-8 ${lang === 'ar' ? 'left-8' : 'right-8'} flex gap-4`}>
            {isSearching ? (
              <button 
                onClick={handleStop} 
                className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest-pro shadow-2xl transition-all hover:bg-red-500 border border-red-400/30 flex items-center gap-3"
              >
                <i className="fas fa-circle-stop animate-pulse"></i> {t.stopProcess}
              </button>
            ) : (
              <button 
                onClick={handleSearch} 
                disabled={!prompt} 
                className="bg-indigo-600 text-white px-12 py-5 rounded-2xl flex items-center gap-4 hover:scale-[1.03] active:scale-[0.97] transition-all font-black text-[11px] uppercase tracking-widest-pro disabled:opacity-20 shadow-xl shadow-indigo-500/30"
              >
                <i className="fas fa-satellite-dish"></i> {t.startInference}
              </button>
            )}
          </div>
        </div>
        
        {isSearching && (
          <div className="mt-8 flex flex-col md:flex-row items-center justify-between px-10 gap-6">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin"></div>
               <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest-pro animate-pulse">
                 {lang === 'ar' ? 'جاري مسح قواعد البيانات العالمية...' : 'SWEEPING GLOBAL REGISTRIES...'}
               </span>
            </div>
            <div className="text-[10px] font-mono text-slate-500">TOKENS USED: 1,420 • DEPTH: 16-LEVELS</div>
          </div>
        )}
      </div>

      {scannedResults.length > 0 && (
        <div className="animate-slide-up space-y-10">
          <div className="flex justify-between items-end border-b border-white/10 pb-6 px-4">
             <div>
                <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-widest-pro mb-2">{t.viewOpportunities}</h4>
                <div className="text-3xl font-black text-white">{scannedResults.length} ASSETS FOUND</div>
             </div>
             <button onClick={addAllToPipeline} className="bg-white text-black px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest-pro hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
              {t.inject}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className="glass-card p-10 rounded-[48px] group relative overflow-hidden">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <span className="text-3xl font-black text-green-500 tabular-nums">${r.estimatedPrice}</span>
                    <div className="text-[9px] font-black text-slate-500 uppercase mt-2 tracking-widest">MIN BID</div>
                  </div>
                  <h5 className="text-xl font-black text-white truncate max-w-[160px] group-hover:text-indigo-400 transition-colors uppercase italic tracking-tighter">{r.name}</h5>
                </div>
                
                <p className={`text-xs text-slate-400 leading-relaxed italic mb-10 border-indigo-500/30 ${lang === 'ar' ? 'text-right border-r-2 pr-6' : 'text-left border-l-2 pl-6'}`}>
                  "{r.justification}"
                </p>
                
                <div className="pt-8 border-t border-white/5 flex justify-between items-center">
                  <div className="flex flex-col">
                     <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">PROBABILITY</span>
                     <span className="text-sm font-black text-indigo-500">{Math.round((r.probability || 0.5) * 100)}%</span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-600 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <i className="fas fa-plus"></i>
                  </div>
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
