
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
    
    addLog('Discovery Agent', lang === 'ar' ? 'بدء مسح السوق الاستراتيجي...' : 'Initiating strategic market sweep...');

    try {
      const results = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal);
      setScannedResults(results);
      addLog('Discovery Agent', lang === 'ar' ? `اكتمل المسح. تم العثور على ${results.length} فرصة.` : `Scan complete. Found ${results.length} opportunities.`, 'success');
    } catch (e: any) {
      if (e.name === 'AbortError') {
        addLog('System', t.processAborted, 'warning');
      } else {
        addLog('System', lang === 'ar' ? 'خطأ في الاتصال بالمحرك.' : 'Engine communication error.', 'critical');
      }
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const addAllToPipeline = () => {
    // Corrected technicalMetrics to satisfy the interface requirements by adding backlinkVelocity
    const formatted: Domain[] = scannedResults.map(r => ({
      id: Math.random().toString(36).substr(2, 9),
      name: r.name,
      price: r.estimatedPrice || 0,
      status: 'available',
      contentStatus: 'none',
      lastChecked: new Date().toISOString(),
      sector: r.name.split('.')[0],
      justification: r.justification,
      probability: r.probability || 0.5,
      technicalMetrics: { 
        da: 0, 
        pa: 0, 
        spamScore: 0, 
        backlinks: 0, 
        backlinkVelocity: 0,
        historyYears: 0, 
        isBlacklisted: false, 
        trademarkRisk: 'Low',
        liquidityScore: Math.round((r.probability || 0.5) * 100) 
      }
    }));
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
  };

  return (
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="relative group">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full glass dark:glass-dark rounded-[32px] px-8 py-8 text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all min-h-[160px] shadow-2xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className={`absolute bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex gap-3`}>
            {isSearching ? (
              <button onClick={() => abortControllerRef.current?.abort()} className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg animate-pulse">
                {t.stopProcess}
              </button>
            ) : (
              <button onClick={handleSearch} disabled={!prompt} className="bg-slate-900 dark:bg-white dark:text-black text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-20 shadow-xl">
                <i className="fas fa-satellite-dish"></i> {t.startInference}
              </button>
            )}
          </div>
        </div>
      </div>

      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass dark:glass-dark p-8 rounded-[40px] animate-pulse space-y-4">
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-white/10 rounded"></div>
              <div className="h-20 w-full bg-slate-100 dark:bg-white/5 rounded"></div>
              <div className="h-4 w-1/2 bg-slate-100 dark:bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && scannedResults.length === 0 && (
        <div className="text-center py-20 opacity-20">
          <i className="fas fa-radar text-6xl mb-4"></i>
          <p className="text-sm uppercase font-black tracking-widest">{t.awaitingSignal}</p>
        </div>
      )}

      {scannedResults.length > 0 && (
        <div className="animate-slide-up space-y-8">
          <div className="flex justify-between items-center px-4">
            <button onClick={addAllToPipeline} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
              {t.inject}
            </button>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scannedResults.length} {t.viewOpportunities}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className="glass dark:glass-dark p-8 rounded-[40px] border border-transparent hover:border-indigo-500/30 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xl font-black text-indigo-500">${r.estimatedPrice}</span>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white truncate max-w-[150px]">{r.name}</h5>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic mb-8 flex-1">
                  "{r.justification}"
                </p>
                <div className="pt-6 border-t border-slate-100 dark:border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase">{t.integrity}: {Math.round((r.probability || 0.5) * 100)}%</span>
                  <i className="fas fa-check-circle text-green-500"></i>
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
