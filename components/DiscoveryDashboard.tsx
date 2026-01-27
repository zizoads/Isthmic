
import React, { useState, useRef } from 'react';
import { Domain, TechnicalMetrics, DomainFinancials } from '../types';
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
    const formatted: Domain[] = scannedResults.map(r => {
      const acq = r.estimatedPrice || 250;
      const target = r.targetExitPrice || acq * 10;
      const financials: DomainFinancials = {
        acquisitionCost: acq,
        holdingCostPerYear: 15,
        targetExitPrice: target,
        projectedROI: Math.round(((target - acq) / acq) * 100),
        netProfit: target - acq,
        platformFees: Math.round(target * 0.15),
        escrowFees: Math.round(target * 0.03),
        liquidityScore: Math.round((r.probability || 0.5) * 100),
        alphaScore: r.alphaScore || 50
      };

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
        financials
      };
    });
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
  };

  return (
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto">
        <div className={`relative group glass-panel rounded-[32px] p-2 border border-white/10 ${isSearching ? 'scanning-effect' : ''}`}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={t.searchPlaceholder}
            className={`w-full bg-transparent text-white px-8 py-8 text-lg font-medium outline-none transition-all min-h-[180px] scrollbar-hide ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className={`absolute bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex gap-4`}>
            {isSearching ? (
              <button 
                onClick={() => abortControllerRef.current?.abort()} 
                className="bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all border border-red-500/30"
              >
                <i className="fas fa-hand-paper mr-2"></i> {t.stopProcess}
              </button>
            ) : (
              <button 
                onClick={handleSearch} 
                disabled={!prompt} 
                className="bg-indigo-600 text-white px-10 py-4 rounded-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-20 shadow-xl shadow-indigo-500/20"
              >
                <i className="fas fa-satellite-dish"></i> {t.startInference}
              </button>
            )}
          </div>
        </div>
        
        {isSearching && (
          <div className="mt-6 flex items-center justify-between px-6">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
              {lang === 'ar' ? 'جاري سحب البيانات من محركات البحث العالمية...' : 'Harvesting data from global search engines...'}
            </span>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 animate-[progress_3s_infinite]"></div>
            </div>
          </div>
        )}
      </div>

      {!isSearching && scannedResults.length === 0 && (
        <div className="text-center py-32 opacity-10">
          <i className="fas fa-radar text-8xl mb-6 text-indigo-500"></i>
          <p className="text-sm uppercase font-black tracking-[0.5em] text-slate-400">{t.awaitingSignal}</p>
        </div>
      )}

      {scannedResults.length > 0 && (
        <div className="animate-slide-up space-y-8">
          <div className="flex justify-between items-center px-4">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{scannedResults.length} {t.viewOpportunities}</h4>
             <button onClick={addAllToPipeline} className="bg-indigo-600 text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-lg">
              {t.inject}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className="bg-[#0b0b14] p-8 rounded-[40px] border border-white/5 hover:border-indigo-500/50 transition-all group shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-2xl font-black text-green-500">${r.estimatedPrice}</span>
                    <div className="text-[8px] font-black text-slate-500 uppercase mt-1">Acquisition</div>
                  </div>
                  <h5 className="text-xl font-black text-white truncate max-w-[150px]">{r.name}</h5>
                </div>
                
                <div className="bg-white/5 p-4 rounded-2xl mb-6">
                   <div className="flex justify-between items-center">
                      <div className="text-[8px] font-black text-indigo-400 uppercase">Alpha Score</div>
                      <div className="text-sm font-black text-white">{r.alphaScore || 50}/100</div>
                   </div>
                </div>

                <p className={`text-xs text-slate-400 leading-relaxed italic mb-8 border-indigo-500/20 ${lang === 'ar' ? 'text-right border-r-2 pr-4' : 'text-left border-l-2 pl-4'}`}>
                  "{r.justification}"
                </p>
                
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-600 uppercase">Probability: {Math.round((r.probability || 0.5) * 100)}%</span>
                  <div className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center">
                    <i className="fas fa-check-circle"></i>
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
