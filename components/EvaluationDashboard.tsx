
import React, { useState, useRef } from 'react';
import { Domain, ThinkingStep } from '../types';
import { evaluateDomainExpertAI, checkTrademarkRiskAI } from '../services/geminiService';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  lang: 'ar' | 'en';
}

const EvaluationDashboard: React.FC<Props> = ({ domains, setDomains, addLog, lang }) => {
  const t = translations[lang];
  const { trackUsage } = useDomainContext();
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [isCached, setIsCached] = useState(false);
  const [liveSteps, setLiveSteps] = useState<ThinkingStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    setActiveAnalysis(null);
    setIsCached(false);
    abortControllerRef.current = new AbortController();

    setLiveSteps([
      { id: '1', action: t.groundedSearch, finding: lang === 'ar' ? 'الاتصال بمحركات السوق...' : 'Connecting to Market APIs...', status: 'searching' },
      { id: '2', action: t.historyAudit, finding: lang === 'ar' ? 'تحليل بصمات Wayback Machine...' : 'Analyzing Wayback Machine fingerprints...', status: 'pending' },
      { id: '3', action: t.blacklistCheck, finding: lang === 'ar' ? 'فحص قواعد بيانات VirusTotal...' : 'Checking VirusTotal databases...', status: 'pending' },
      { id: '4', action: t.riskAssessment, finding: lang === 'ar' ? 'تحليل عوامل خطر العلامة التجارية...' : 'Analyzing trademark risk factors...', status: 'pending' }
    ]);

    try {
      // 1. Check Forensic Engine (with Cache)
      const response = await evaluateDomainExpertAI(domain.name, lang, abortControllerRef.current.signal);
      
      // 2. Parallel Trademark Check
      const tmResult = await checkTrademarkRiskAI(domain.name);
      
      if (response) {
        setLiveSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
        setActiveAnalysis(response.data);
        setIsCached(response.cached);
        
        if (!response.cached) {
          await trackUsage('audit');
          addLog('System', `Live Forensic Audit complete for ${domain.name}`, 'success');
        } else {
          addLog('System', `Institutional Memory Hit for ${domain.name}`, 'success');
        }

        setDomains(prev => prev.map(d => d.id === domain.id ? {
          ...d,
          sector: response.data.sector,
          probability: response.data.probability,
          justification: response.data.justification,
          technicalMetrics: { ...response.data.technicalMetrics, trademarkRisk: tmResult }
        } : d));
      }
    } catch (e: any) {
      if (e.message === 'Aborted') {
        addLog('System', t.processAborted, 'warning');
      } else {
        addLog('System', lang === 'ar' ? 'فشل فحص التدقيق.' : 'Forensic audit failed.', 'critical');
      }
    } finally {
      setEvaluatingId(null);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* List Panel */}
      <div className="lg:col-span-7 space-y-6 lg:space-y-8">
        <header className={lang === 'ar' ? 'text-right' : 'text-left'}>
          <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{t.evaluation}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-2">{t.proMode} {t.active}</p>
        </header>

        <div className="glass dark:glass-dark rounded-[40px] overflow-x-auto">
          <table className={`w-full text-sm min-w-[500px] ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {domains.length === 0 ? (
                <tr>
                   <td className="px-10 py-20 text-center opacity-30 text-slate-400 italic">لا توجد نطاقات في قائمة الانتظار</td>
                </tr>
              ) : domains.map(domain => (
                <tr key={domain.id} className={`hover:bg-slate-50/50 dark:hover:bg-white/5 transition-all ${evaluatingId === domain.id ? 'bg-indigo-50/50 dark:bg-indigo-500/5' : ''}`}>
                  <td className="px-6 lg:px-10 py-6 lg:py-8">
                    <div className="font-black text-slate-900 dark:text-white text-lg truncate max-w-[200px]">{domain.name}</div>
                    <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || t.uncategorized}</div>
                  </td>
                  <td className="px-6 lg:px-10 py-6 lg:py-8">
                    <div className={`flex gap-4 items-center ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      {evaluatingId === domain.id ? (
                        <button onClick={handleStop} className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-red-600 transition-all">
                          {t.stopProcess}
                        </button>
                      ) : (
                        <button onClick={() => handleEvaluate(domain)} className="bg-slate-900 dark:bg-white dark:text-black text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg">
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

      {/* Thinking Console */}
      <div className="lg:col-span-5 space-y-6 lg:space-y-8">
        <div className="bg-[#0b0e14] rounded-[40px] text-white p-8 lg:p-10 shadow-2xl h-[450px] flex flex-col border border-white/5 relative overflow-hidden">
          <h4 className={`text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.reasoningConsole}</h4>
          <div className={`flex-1 overflow-y-auto space-y-6 font-mono custom-scrollbar ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            {liveSteps.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <i className="fas fa-terminal text-4xl mb-4"></i>
                <p className="text-[10px] uppercase tracking-[0.3em]">{t.awaitingSignal}</p>
              </div>
            ) : liveSteps.map(step => (
              <div key={step.id} className={`border-indigo-500/30 py-1 ${lang === 'ar' ? 'border-r-2 pr-6' : 'border-l-2 pl-6'}`}>
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-black uppercase ${step.status === 'complete' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                    {step.status === 'complete' ? t.passed : t.executing}
                  </span>
                  <span className="text-white font-black text-[10px]">{step.action}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
              </div>
            ))}
          </div>
          <div className="absolute top-16 left-0 w-full h-8 bg-gradient-to-b from-[#0b0e14] to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#0b0e14] to-transparent pointer-events-none"></div>
        </div>

        <div className="glass dark:glass-dark rounded-[40px] p-8 lg:p-10 flex-1 flex flex-col min-h-[250px] relative">
          <h4 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.investmentReport}</h4>
          {activeAnalysis ? (
            <div className={`space-y-6 animate-fade-in ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-6">
                  <div className="text-4xl font-black text-indigo-600">{activeAnalysis.probability ? Math.round(activeAnalysis.probability * 100) : 0}%</div>
                  <div className="text-[9px] font-black text-slate-400 uppercase leading-none">{t.liquidityScore}</div>
                </div>
                {isCached && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-[8px] font-black uppercase tracking-widest">
                    Institutional Memory Hit
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic">
                "{activeAnalysis.justification}"
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-20">
              <i className="fas fa-file-contract text-6xl"></i>
              <p className="mt-4 text-[10px] uppercase font-black">{t.awaitingAudit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
