
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
      id: Math.random().toString(36).substr(2, 9),
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
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`relative bg-[#08090d] border border-white/10 rounded-[40px] p-2 overflow-hidden ${isSearching ? 'shimmer-bar' : ''}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full bg-transparent text-white px-10 py-10 text-xl font-medium outline-none transition-all min-h-[220px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
             <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <i className="fas fa-network-wired"></i> Gemini 3 Pro Engine
             </div>
             {isSearching ? (
                <button onClick={handleStop} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-3 shadow-xl">
                  <i className="fas fa-stop"></i> {t.stopProcess}
                </button>
             ) : (
                <button onClick={handleSearch} disabled={!prompt} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-20">
                  {t.startInference}
                </button>
             )}
          </div>
        </div>
      </div>

      {scannedResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
           {scannedResults.map((r, i) => (
             <div key={i} className="bg-[#08090d] border border-white/5 p-8 rounded-3xl hover:border-indigo-500/30 transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-6">
                   <div className="text-2xl font-black text-white italic group-hover:text-indigo-400 truncate max-w-[140px]">{r.name}</div>
                   <div className="text-lg font-black text-green-500 tabular-nums">${r.estimatedPrice}</div>
                </div>
                <p className="text-[11px] text-slate-400 italic leading-relaxed line-clamp-3 mb-6">"{r.justification}"</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                   <div className="text-[9px] font-black text-slate-600 uppercase">Probability: {Math.round(r.probability * 100)}%</div>
                   <button onClick={addAllToPipeline} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-500 hover:bg-indigo-600 hover:text-white transition-all">
                     <i className="fas fa-plus"></i>
                   </button>
                </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

// Exporting DiscoveryDashboard as the default export to satisfy imports in AcquisitionDesk.tsx
export default DiscoveryDashboard;
