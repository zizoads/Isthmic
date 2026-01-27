
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
      const fees = target * 0.18; // Platform + Escrow approx
      const net = target - acq - fees - 15;
      const roi = (net / acq) * 100;

      const financials: DomainFinancials = {
        acquisitionCost: acq,
        holdingCostPerYear: 15,
        targetExitPrice: target,
        projectedROI: Math.round(roi),
        netProfit: Math.round(net),
        platformFees: Math.round(target * 0.15),
        escrowFees: Math.round(target * 0.03),
        liquidityScore: Math.round((r.probability || 0.5) * 100),
        alphaScore: r.alphaScore || 50
      };

      const metrics: TechnicalMetrics = {
        da: r.metrics?.da || 0,
        pa: 0,
        spamScore: r.metrics?.spamScore || 0,
        backlinks: r.metrics?.backlinks || 0,
        backlinkVelocity: 0,
        historyYears: 0,
        isBlacklisted: false,
        trademarkRisk: r.metrics?.trademarkRisk || 'Low',
        liquidityScore: financials.liquidityScore
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
        financials,
        technicalMetrics: metrics
      };
    });
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
            className={`w-full bg-[#0b0e14] text-white border border-white/10 rounded-[32px] px-8 py-8 text-lg font-medium outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all min-h-[160px] shadow-2xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}
          />
          <div className={`absolute bottom-6 ${lang === 'ar' ? 'left-6' : 'right-6'} flex gap-3`}>
            {isSearching ? (
              <button onClick={() => abortControllerRef.current?.abort()} className="bg-red-500 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg animate-pulse">
                {t.stopProcess}
              </button>
            ) : (
              <button onClick={handleSearch} disabled={!prompt} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl flex items-center gap-3 hover:scale-105 transition-all font-black text-[10px] uppercase tracking-widest disabled:opacity-20 shadow-xl">
                <i className="fas fa-satellite-dish"></i> {t.startInference}
              </button>
            )}
          </div>
        </div>
      </div>

      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-[#0b0e14] p-8 rounded-[40px] animate-pulse space-y-4 border border-white/5">
              <div className="h-6 w-3/4 bg-white/10 rounded"></div>
              <div className="h-20 w-full bg-white/5 rounded"></div>
              <div className="h-4 w-1/2 bg-white/5 rounded"></div>
            </div>
          ))}
        </div>
      )}

      {!isSearching && scannedResults.length === 0 && (
        <div className="text-center py-20 opacity-20">
          <i className="fas fa-radar text-6xl mb-4 text-indigo-500"></i>
          <p className="text-sm uppercase font-black tracking-widest text-slate-400">{t.awaitingSignal}</p>
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
              <div key={i} className="bg-[#0b0e14] p-8 rounded-[40px] border border-white/10 hover:border-indigo-500/50 transition-all group flex flex-col h-full shadow-xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-xl font-black text-green-500">${r.estimatedPrice}</span>
                    <div className="text-[8px] font-black text-slate-500 uppercase mt-1">Acquisition Cost</div>
                  </div>
                  <h5 className="text-xl font-black text-white truncate max-w-[150px]">{r.name}</h5>
                </div>
                
                <div className="flex justify-between items-center mb-6 p-4 bg-white/5 rounded-2xl">
                   <div>
                      <div className="text-[8px] font-black text-indigo-400 uppercase">Alpha Score</div>
                      <div className="text-xl font-black text-white">{r.alphaScore || 50}/100</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[8px] font-black text-green-400 uppercase">Est. ROI</div>
                      <div className="text-xl font-black text-white">+{Math.round(((r.targetExitPrice - r.estimatedPrice) / r.estimatedPrice) * 100)}%</div>
                   </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed italic mb-8 flex-1 border-r-2 border-white/5 pr-4">
                  "{r.justification}"
                </p>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-500 uppercase">{t.integrity}: {Math.round((r.probability || 0.5) * 100)}%</span>
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
