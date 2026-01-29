
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
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!prompt) return;
    setIsSearching(true);
    setScannedResults([]);
    abortControllerRef.current = new AbortController();
    addLog('Discovery', lang === 'ar' ? 'بدء تنقيب السوق الاستراتيجي...' : 'Initiating strategic market mining...', 'info');

    try {
      const results = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal);
      setScannedResults(results);
      addLog('Discovery', `Mining complete. Found ${results.length} opportunities.`, 'success');
    } catch (e: any) {
      if (e.name === 'AbortError') addLog('System', t.processAborted, 'warning');
      else addLog('System', 'Engine communication failure', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setIsSearching(false);
  };

  const addAllToPipeline = () => {
    const formatted: Domain[] = scannedResults.map(r => ({
      id: globalThis.crypto.randomUUID(),
      name: r.name,
      price: r.estimatedPrice || 250,
      status: 'available',
      contentStatus: 'none',
      lastChecked: new Date().toISOString(),
      sector: r.sector || r.name.split('.')[0],
      justification: r.justification,
      probability: r.probability || 0.5
    }));
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
  };

  return (
    <div className="space-y-16 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        <div className={`square-card p-2 transition-all duration-500 ${isSearching ? 'border-indigo-500 ring-4 ring-indigo-500/10' : ''}`}>
          <div className="bg-[#050507] rounded-[22px] p-6 lg:p-10 relative overflow-hidden">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label={t.searchPlaceholder}
              placeholder={t.searchPlaceholder}
              className={`w-full bg-transparent text-white px-2 py-4 text-xl font-medium outline-none transition-all min-h-[160px] custom-scrollbar ${lang === 'ar' ? 'text-right' : 'text-left'}`}
            />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8 pt-8 border-t border-white/5 relative z-10">
               <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <i className="fas fa-satellite text-indigo-400"></i>
                    <span>Gemini_3_Pro</span>
                  </div>
                  <div className="hidden sm:block">Grounding: Search_Live</div>
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto">
                 {isSearching ? (
                    <button 
                      onClick={handleStop} 
                      className="bg-red-500/10 text-red-500 border border-red-500/20 px-10 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center gap-3 w-full md:w-auto justify-center"
                    >
                      <i className="fas fa-square"></i> {t.stopProcess}
                    </button>
                 ) : (
                    <button 
                      onClick={handleSearch} 
                      disabled={!prompt} 
                      className="square-button px-14 py-4 w-full md:w-auto justify-center disabled:opacity-20"
                    >
                      {t.startInference} <i className="fas fa-arrow-right ml-2 text-[10px]"></i>
                    </button>
                 )}
               </div>
            </div>
            
            {/* Design detail from Square UI: Subtle accent in background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>

      {scannedResults.length > 0 && (
        <div className="space-y-10 animate-slide-up">
           <div className="flex justify-between items-end border-b border-white/5 pb-6">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Inferred_Opportunities</h3>
                <div className="text-3xl font-black text-white mt-1 italic tracking-tighter">Harvested_ {scannedResults.length} Assets</div>
              </div>
              <button onClick={addAllToPipeline} className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
                <i className="fas fa-plus-circle mr-2"></i> Add All To Pipeline
              </button>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {scannedResults.map((r, i) => (
                <div key={i} className="square-card p-8 hover:border-indigo-500/40 group relative">
                   <div className="flex justify-between items-start mb-6">
                      <div className="text-2xl font-black text-white italic truncate max-w-[160px] tracking-tighter">{r.name}</div>
                      <div className="text-lg font-black text-green-400 data-mono">${r.estimatedPrice}</div>
                   </div>
                   
                   <p className="text-xs text-slate-400 italic leading-relaxed line-clamp-3 mb-10 h-12">"{r.justification}"</p>
                   
                   <div className="flex justify-between items-center pt-6 border-t border-white/5">
                      <div className="space-y-1">
                        <div className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Confidence_Rating</div>
                        <div className="text-[11px] font-black text-indigo-400 data-mono">{Math.round(r.probability * 100)}%</div>
                      </div>
                      <button 
                       onClick={() => setDomains(p => [{ id: globalThis.crypto.randomUUID(), ...r, status: 'available' }, ...p])} 
                       className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 hover:bg-white hover:text-black transition-all"
                      >
                        <i className="fas fa-plus"></i>
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
