import React, { useState, useRef } from 'react';
import { Domain, ThinkingStep } from '../../types';
import { evaluateDomainExpertAI, checkTrademarkRiskAI } from '../../services/geminiService';
import { translations } from '../../translations';
import { useDomainContext } from '../../context/DomainContext';

interface Props {
  domains: Domain[];
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical', payload?: any) => void;
}

const EvaluationDashboard: React.FC<Props> = ({ domains, addLog }) => {
  const t = translations.en;
  const { updateDomain } = useDomainContext();
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [liveSteps, setLiveSteps] = useState<ThinkingStep[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    setActiveAnalysis(null);
    abortControllerRef.current = new AbortController();

    setLiveSteps([
      { id: '1', action: t.groundedSearch, finding: 'Connecting to Market APIs...', status: 'searching' },
      { id: '2', action: t.historyAudit, finding: 'Analyzing Wayback Machine fingerprints...', status: 'pending' },
      { id: '3', action: t.blacklistCheck, finding: 'Checking VirusTotal databases...', status: 'pending' },
      { id: '4', action: t.riskAssessment, finding: 'Analyzing trademark risk factors...', status: 'pending' }
    ]);

    try {
      const response = await evaluateDomainExpertAI(domain.name, abortControllerRef.current.signal);
      const tmResult = await checkTrademarkRiskAI(domain.name);
      
      if (response) {
        setLiveSteps((prev: ThinkingStep[]) => prev.map(s => ({ ...s, status: 'complete' as const })));
        setActiveAnalysis(response.data);
        
        await updateDomain({
          ...domain,
          sector: response.data.sector,
          probability: response.data.probability,
          justification: response.data.justification,
          technicalMetrics: { ...response.data.technicalMetrics, trademarkRisk: tmResult }
        });
      }
    } catch (e: any) {
      if (e.message !== 'Aborted') addLog('System', 'Forensic audit failed.', 'critical');
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in" dir="ltr">
      <div className="lg:col-span-7 space-y-8">
        <header className="mb-10">
          <h3 className="text-4xl font-black text-white uppercase tracking-tighter italic">FORENSIC AUDIT</h3>
          <p className="text-[10px] text-[#d4af37] font-black uppercase mt-2 tracking-[0.3em]">Causal Feedback Protocol: ACTIVE</p>
        </header>

        <div className="bg-[#08080a] border border-white/5 rounded-[40px] overflow-hidden">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-white/5">
              {domains.length === 0 ? (
                <tr><td className="px-10 py-20 text-center opacity-30 italic text-slate-500">No units in queue.</td></tr>
              ) : domains.map(domain => (
                <tr key={domain.id} className={`hover:bg-white/5 transition-all ${evaluatingId === domain.id ? 'bg-[#d4af37]/5' : ''}`}>
                  <td className="px-10 py-8">
                    <div className="font-black text-white text-xl italic tracking-tighter">{domain.name}</div>
                    <div className="text-[9px] text-[#d4af37] font-black uppercase mt-2 tracking-widest">
                       Match: {domain.strategicAlignmentScore || 0}% 
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    {evaluatingId === domain.id ? (
                      <button onClick={handleStop} className="bg-red-900/20 text-red-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-900/40 transition-all">STOP</button>
                    ) : (
                      <button onClick={() => handleEvaluate(domain)} className="bg-white text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#d4af37] transition-all shadow-xl">AUDIT UNIT</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-8">
        <div className="bg-[#08080a] rounded-[40px] p-10 border border-white/5 h-[400px] flex flex-col relative overflow-hidden shadow-inner">
          <h4 className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest mb-10">REASONING CONSOLE</h4>
          <div className="flex-1 overflow-y-auto space-y-8 font-mono custom-scrollbar">
            {liveSteps.map(step => (
              <div key={step.id} className="border-l-2 border-[#d4af37]/30 pl-6 py-1">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${step.status === 'complete' ? 'text-emerald-500' : 'text-[#d4af37] animate-pulse'}`}>
                    {step.status === 'complete' ? 'PASSED' : 'EXECUTING'}
                  </span>
                  <span className="text-white font-black text-[10px] uppercase tracking-widest">{step.action}</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
              </div>
            ))}
          </div>
        </div>

        {activeAnalysis && (
          <div className="bg-[#08080a] border border-white/5 p-10 rounded-[40px] space-y-6 animate-slide-up">
            <div className="flex items-center justify-between">
               <div className="text-5xl font-black text-white italic tracking-tighter">{Math.round(activeAnalysis.probability * 100)}%</div>
               <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Liquidity Alpha</div>
            </div>
            <p className="text-sm text-slate-400 italic leading-relaxed border-l border-[#d4af37]/30 pl-4">"{activeAnalysis.justification}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluationDashboard;
