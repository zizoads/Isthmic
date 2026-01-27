
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
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className={`relative bg-[#05060a] border border-white/10 rounded-[32px] p-2 overflow-hidden ${isSearching ? 'shimmer-bar' : ''}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            aria-label={t.searchPlaceholder}
            placeholder={t.searchPlaceholder}
            className={`w-full bg-transparent text-white px-8 py-8 text-lg font-medium outline-none transition-all min-h-[180px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
             <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <i className="fas fa-network-wired text-indigo-400"></i> Gemini 3 Pro
             </div>
             {isSearching ? (
                <button 
                  onClick={handleStop} 
                  aria-label={t.stopProcess}
                  className="bg-red-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 transition-all flex items-center gap-2"
                >
                  <i className="fas fa-stop"></i> {t.stopProcess}
                </button>
             ) : (
                <button 
                  onClick={handleSearch} 
                  disabled={!prompt} 
                  aria-label={t.startInference}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl disabled:opacity-20"
                >
                  {t.startInference}
                </button>
             )}
          </div>
        </div>
      </div>

      {scannedResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-up">
           {scannedResults.map((r, i) => (
             <div key={i} className="bg-[#05060a] border border-white/10 p-6 rounded-2xl hover:border-indigo-500/50 transition-all relative overflow-hidden group">
                <div className="flex justify-between items-start mb-4">
                   <div className="text-xl font-black text-white italic truncate max-w-[120px]">{r.name}</div>
                   <div className="text-base font-black text-green-400 tabular-nums">${r.estimatedPrice}</div>
                </div>
                <p className="text-[10px] text-slate-400 italic leading-relaxed line-clamp-3 mb-6">"{r.justification}"</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/5">
                   <div className="text-[8px] font-black text-slate-500 uppercase">Confidence: {Math.round(r.probability * 100)}%</div>
                   <button 
                    onClick={addAllToPipeline} 
                    aria-label="إضافة للإنتاج"
                    className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 hover:bg-indigo-600 hover:text-white transition-all"
                   >
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

export default DiscoveryDashboard;
