
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
    
    addLog('System', lang === 'ar' ? 'بدء الاستكشاف اللحظي...' : 'Starting real-time discovery...');

    try {
      const results = await rigorousDiscoveryAI(prompt, lang, abortControllerRef.current.signal);
      setScannedResults(results);
      addLog('System', lang === 'ar' ? `اكتمل المسح. تم العثور على ${results.length} فرصة.` : `Scan complete. Found ${results.length} opportunities.`, 'success');
    } catch (e: any) {
      if (e.message === 'Aborted') {
        addLog('System', t.processAborted, 'warning');
      } else {
        addLog('System', lang === 'ar' ? 'فشل المسح الاستراتيجي.' : 'Strategic scan failed.', 'critical');
      }
    } finally {
      setIsSearching(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
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
      sector: r.name.split('.')[0],
      justification: r.justification,
      probability: r.probability,
      technicalMetrics: { liquidityScore: Math.round(r.probability * 100) }
    }));
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
    addLog('System', t.inject, 'success');
  };

  return (
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Search Container - OpenAI Style */}
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
              <button 
                onClick={handleStop}
                className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
              >
                <i className="fas fa-stop"></i> {t.stopProcess}
              </button>
            ) : (
              <button 
                onClick={handleSearch}
                disabled={!prompt}
                className="bg-slate-900 dark:bg-white dark:text-black text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-20 shadow-xl"
              >
                <i className="fas fa-arrow-up"></i> {t.startInference}
              </button>
            )}
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className={`flex gap-6 px-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> {t.groundedSearch}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span> {t.verifiedComps}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      {scannedResults.length > 0 && (
        <div className="animate-slide-up space-y-8">
          <div className={`flex justify-between items-center px-4 ${lang === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
            <button onClick={addAllToPipeline} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg">
              {t.inject}
            </button>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{scannedResults.length} {t.viewOpportunities}</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className={`glass dark:glass-dark p-8 rounded-[40px] hover:border-indigo-500/30 transition-all group flex flex-col h-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex justify-between items-start mb-6">
                  <span className="text-xl font-black text-indigo-500">${r.estimatedPrice}</span>
                  <h5 className="text-xl font-black text-slate-900 dark:text-white">{r.name}</h5>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic mb-8 flex-1">
                  "{r.justification}"
                </p>
                <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-white/5">
                  <div className="text-[9px] font-black text-slate-400 uppercase">{t.integrity}: {Math.round(r.probability * 100)}%</div>
                  <div className="flex gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <i className="fas fa-shield-alt text-indigo-500"></i>
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
