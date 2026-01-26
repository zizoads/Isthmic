
import React, { useState, useRef } from 'react';
import { Domain } from '../types';
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
  
  // Abort controller to stop long AI tasks
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    
    setIsSearching(true);
    setScannedResults([]);
    addLog('Sniper Engine', `${t.scanningRegistrars}: ${prompt}`);
    
    abortControllerRef.current = new AbortController();

    try {
      const results = await rigorousDiscoveryAI(prompt, lang);
      // In a real scenario, we'd pass the signal to the fetch call inside rigorousDiscoveryAI
      // But for this simulation, we check if it was aborted
      if (abortControllerRef.current.signal.aborted) {
        addLog('System', t.processAborted, 'warning');
        return;
      }
      
      setScannedResults(results);
      addLog('Sniper Engine', `${t.passed}: ${results.length}`, 'success');
    } catch (e) {
      addLog('Sniper Engine', t.processAborted, 'critical');
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const stopSearch = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsSearching(false);
      addLog('System', t.processAborted, 'warning');
    }
  };

  const addAllToPipeline = () => {
    const formatted = scannedResults.map(r => ({
      id: Math.random().toString(),
      name: r.name,
      price: r.estimatedPrice,
      status: 'available' as const,
      contentStatus: 'none' as const,
      lastChecked: new Date().toISOString(),
      sector: r.justification.split(' ')[0],
      justification: r.justification,
      probability: r.probability,
      technicalMetrics: {
        liquidityScore: Math.round(r.probability * 100)
      }
    }));
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
    addLog('System', t.inject, 'success');
  };

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#0b0e14] p-10 lg:p-14 rounded-[40px] text-white shadow-2xl relative border border-white/5 overflow-hidden">
        <div className="relative z-10 max-w-4xl">
          <div className={`flex items-center gap-4 mb-8 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fas fa-crosshairs"></i>
             </div>
             <div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">{t.discovery}</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">{t.proMode} {t.active}</p>
             </div>
          </div>
          
          <div className="space-y-6">
            <textarea
              placeholder={t.searchPlaceholder}
              className={`w-full bg-white/5 border border-white/10 rounded-[30px] px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all h-32 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className={`flex flex-col lg:flex-row justify-between items-center gap-4`}>
               <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase">Afternic Live</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                     <span className="text-[10px] font-black text-slate-500 uppercase">NameBio Grounded</span>
                  </div>
               </div>
               
               <div className="flex gap-3 w-full lg:w-auto">
                 {isSearching && (
                   <button 
                    onClick={stopSearch}
                    className="flex-1 lg:flex-none bg-red-600 text-white px-8 py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all"
                   >
                     {t.stopProcess}
                   </button>
                 )}
                 <button 
                   onClick={handleSearch} 
                   disabled={isSearching || !prompt}
                   className="flex-1 lg:flex-none bg-indigo-600 text-white px-14 py-5 rounded-[22px] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                 >
                   {isSearching ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-satellite-dish"></i>}
                   <span className="mx-3">{isSearching ? t.thinking : t.startInference}</span>
                 </button>
               </div>
            </div>
          </div>
        </div>
        <i className="fas fa-satellite absolute right-[-40px] bottom-[-40px] text-white/5 text-[220px] pointer-events-none"></i>
      </div>

      {scannedResults.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[40px] border border-slate-100 dark:border-white/5 shadow-sm animate-slide-up">
          <div className={`flex flex-col lg:flex-row justify-between items-center mb-10 gap-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <button onClick={addAllToPipeline} className="w-full lg:w-auto bg-slate-900 dark:bg-indigo-600 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
               {t.inject}
            </button>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scannedResults.length} {t.viewOpportunities}</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className={`p-8 bg-slate-50 dark:bg-white/5 rounded-[32px] border border-slate-100 dark:border-white/5 flex flex-col h-full group transition-all hover:border-indigo-500 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className={`flex justify-between items-start mb-6 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="text-2xl font-black text-indigo-600">${r.estimatedPrice}</div>
                  <div className="font-black text-slate-900 dark:text-white text-xl">{r.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">{t.integrity}</div>
                      <div className="text-xs font-black text-indigo-600">{(r.probability * 100).toFixed(0)}%</div>
                   </div>
                   <div className="bg-white dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-white/5 text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">{t.status}</div>
                      <div className="text-xs font-black text-green-600">{t.verified}</div>
                   </div>
                </div>

                <p className="text-xs text-slate-500 italic leading-relaxed mb-6 flex-1">"{r.justification}"</p>
                
                <div className="pt-6 border-t border-slate-200 dark:border-white/5 flex justify-between items-center">
                   <div className="flex gap-2">
                      <i className="fas fa-shield-check text-green-500 text-xs"></i>
                      <i className="fas fa-search-dollar text-indigo-400 text-xs"></i>
                   </div>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.groundingEngine}</span>
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
