
import React, { useState, useRef } from 'react';
import { Domain, ThinkingStep } from '../types';
import { evaluateDomainExpertAI, checkTrademarkRiskAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
}

const EvaluationDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const t = translations[lang];
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [liveSteps, setLiveSteps] = useState<ThinkingStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    setActiveAnalysis(null);
    abortControllerRef.current = new AbortController();

    setLiveSteps([
      { id: '1', action: t.groundedSearch, finding: lang === 'ar' ? 'الاتصال بمحركات السوق...' : 'Connecting to Market APIs...', status: 'searching' },
      { id: '2', action: t.scanningRegistrars, finding: lang === 'ar' ? 'فحص بصمات الأرشيف...' : 'Scanning Archive.org fingerprints...', status: 'pending' },
      { id: '3', action: t.riskAssessment, finding: lang === 'ar' ? 'تحليل عوامل خطر العلامة التجارية...' : 'Analyzing trademark risk factors...', status: 'pending' }
    ]);

    try {
      const [result, tmResult] = await Promise.all([
        evaluateDomainExpertAI(domain.name, lang),
        checkTrademarkRiskAI(domain.name)
      ]);
      
      if (abortControllerRef.current?.signal.aborted) return;

      if (result) {
        setLiveSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
        setActiveAnalysis(result);
        
        setDomains(prev => prev.map(d => d.id === domain.id ? {
          ...d,
          sector: result.sector,
          probability: result.probability,
          justification: result.justification,
          thinkingPath: result.thinkingPath,
          technicalMetrics: { ...result.technicalMetrics, trademarkRisk: tmResult }
        } : d));
        addLog('Forensic Agent', `${t.passed}: ${domain.name}`, 'success');
      }
    } catch (e) {
      addLog('Forensic Agent', t.processAborted, 'critical');
    } finally {
      setEvaluatingId(null);
      abortControllerRef.current = null;
    }
  };

  const stopAudit = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setEvaluatingId(null);
      addLog('System', t.processAborted, 'warning');
      setLiveSteps(prev => prev.map(s => s.status === 'searching' || s.status === 'pending' ? { ...s, status: 'pending', finding: t.processAborted } : s));
    }
  };

  return (
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#0b0e14] rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className={`relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
          <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">{t.evaluation}</h3>
          <p className={`text-slate-400 text-xs font-black uppercase tracking-widest max-w-xl leading-relaxed ${lang === 'ar' ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
            {t.proMode} {t.active} • {t.reasoningConsole} v2.0
          </p>
        </div>
        <i className="fas fa-microchip absolute left-[-20px] top-[-20px] opacity-10 text-[220px]"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-[40px] border dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-8 border-b dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.totalAssets}: {domains.length}</span>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.queue}</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className={`w-full text-sm ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                {domains.map(domain => (
                  <tr key={domain.id} className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all ${evaluatingId === domain.id ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 dark:text-white text-lg">{domain.name}</div>
                      <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || t.uncategorized}</div>
                    </td>
                    <td className="px-10 py-8">
                       <div className={`flex gap-4 items-center ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                          {evaluatingId === domain.id ? (
                            <button 
                              onClick={stopAudit}
                              className="bg-red-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
                            >
                              {t.stopProcess}
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleEvaluate(domain)}
                              className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:opacity-90 transition-all shadow-lg"
                            >
                              {t.auditAction}
                            </button>
                          )}
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           <div className="bg-[#0b0e14] rounded-[40px] text-white p-10 shadow-2xl flex flex-col h-[400px] border border-white/5 relative overflow-hidden">
              <h4 className={`text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.reasoningConsole}</h4>
              <div className={`flex-1 overflow-y-auto space-y-4 font-mono scrollbar-hide ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 {liveSteps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                       <i className="fas fa-terminal text-4xl mb-4"></i>
                       <p className="text-[10px] uppercase tracking-[0.3em]">{t.awaitingSignal}</p>
                    </div>
                 ) : liveSteps.map(step => (
                    <div key={step.id} className={`border-indigo-500 py-1 ${lang === 'ar' ? 'border-r-2 pr-4' : 'border-l-2 pl-4'}`}>
                       <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-black uppercase ${step.status === 'complete' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                             {step.status === 'complete' ? t.passed : step.status === 'searching' ? t.executing : '...'}
                          </span>
                          <span className="text-white font-black text-[10px]">{step.action}</span>
                       </div>
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white dark:bg-slate-900 rounded-[40px] border dark:border-white/5 shadow-sm p-10 flex-1 flex flex-col">
              <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.investmentReport}</h4>
              {activeAnalysis ? (
                 <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border dark:border-white/5">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-2">{t.liquidityScore}</div>
                       <div className={`flex items-center gap-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                          <div className="text-3xl font-black text-slate-900 dark:text-white">{activeAnalysis.technicalMetrics?.liquidityScore}%</div>
                       </div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-2">{t.strategicLogic}</div>
                       <p className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic border-indigo-500 ${lang === 'ar' ? 'border-r-2 pr-4' : 'border-l-2 pl-4'}`}>
                          "{activeAnalysis.justification}"
                       </p>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-20">
                    <i className="fas fa-file-contract text-7xl"></i>
                    <p className="mt-4 text-[10px] uppercase font-black">{t.awaitingAudit}</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
