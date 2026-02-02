
import React, { useState, useRef } from 'react';
import { Domain, ThinkingStep, RejectionPattern } from '../types';
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
  const { trackUsage, strategy, setStrategy } = useDomainContext();
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [isCached, setIsCached] = useState(false);
  const [liveSteps, setLiveSteps] = useState<ThinkingStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // وظيفة تسجيل التغذية الراجعة العصبية
  const commitToNeuralMemory = (domain: Domain, reason: string) => {
    const newPattern: RejectionPattern = {
      patternId: crypto.randomUUID(),
      reason: reason,
      timestamp: new Date().toISOString(),
      sector: domain.sector || 'General'
    };
    
    setStrategy(prev => ({
      ...prev,
      rejectionPatterns: [newPattern, ...(prev.rejectionPatterns || [])].slice(0, 50) // حفظ آخر 50 نمطاً
    }));
    
    addLog('Master Brain', `Learned from rejection: ${reason}. System weights adjusted.`, 'info');
  };

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
      const response = await evaluateDomainExpertAI(domain.name, lang, abortControllerRef.current.signal);
      const tmResult = await checkTrademarkRiskAI(domain.name);
      
      if (response) {
        setLiveSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
        setActiveAnalysis(response.data);
        setIsCached(response.cached);
        
        // FEEDBACK LOOP ZERO: إذا كانت النتيجة ضعيفة، نغذي المنصة بالسبب فوراً
        if (response.data.probability < 0.5) {
          commitToNeuralMemory(domain, response.data.justification);
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
      if (e.message !== 'Aborted') {
        addLog('System', 'Forensic audit failed.', 'critical');
      }
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="lg:col-span-7 space-y-8">
        <header>
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic">FORENSIC AUDIT</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase mt-2">Active Neural Feedback Loop: ENABLED</p>
        </header>

        <div className="glass-panel overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {domains.length === 0 ? (
                <tr><td className="px-10 py-20 text-center opacity-30 italic">No units in queue.</td></tr>
              ) : domains.map(domain => (
                <tr key={domain.id} className={`hover:bg-white/5 transition-all ${evaluatingId === domain.id ? 'bg-indigo-500/5' : ''}`}>
                  <td className="px-10 py-8">
                    <div className="font-black text-white text-lg italic">{domain.name}</div>
                    <div className="text-[9px] text-indigo-500 font-black uppercase mt-1">
                       Match: {domain.strategicAlignmentScore || 0}% 
                       { (domain.strategicAlignmentScore || 0) >= 80 && <i className="fas fa-crown ml-2 text-amber-500"></i>}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {evaluatingId === domain.id ? (
                      <button onClick={handleStop} className="bg-red-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase">STOP</button>
                    ) : (
                      <button onClick={() => handleEvaluate(domain)} className="bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase hover:bg-[#c5a059] transition-all shadow-xl">AUDIT UNIT</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="bg-[#0b0e14] rounded-[40px] p-10 border border-white/5 h-[400px] flex flex-col relative overflow-hidden shadow-inner">
          <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10">REASONING CONSOLE</h4>
          <div className="flex-1 overflow-y-auto space-y-6 font-mono custom-scrollbar">
            {liveSteps.map(step => (
              <div key={step.id} className="border-l-2 border-indigo-500/30 pl-6 py-1">
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-[9px] font-black uppercase ${step.status === 'complete' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                    {step.status === 'complete' ? 'PASSED' : 'EXECUTING'}
                  </span>
                  <span className="text-white font-black text-[10px]">{step.action}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
              </div>
            ))}
          </div>
        </div>

        {activeAnalysis && (
          <div className="glass-panel p-10 space-y-6 animate-slide-up bg-gradient-to-br from-indigo-500/5 to-transparent">
            <div className="flex items-center justify-between">
               <div className="text-4xl font-black text-white italic">{Math.round(activeAnalysis.probability * 100)}%</div>
               <div className="text-[9px] font-black text-slate-500 uppercase">Liquidity Alpha</div>
            </div>
            <p className="text-sm text-slate-400 italic leading-relaxed">"{activeAnalysis.justification}"</p>
            {activeAnalysis.probability < 0.5 && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-4">
                 <i className="fas fa-brain text-red-500"></i>
                 <span className="text-[9px] font-black text-red-400 uppercase">Neural Penalty Applied</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDashboard;
