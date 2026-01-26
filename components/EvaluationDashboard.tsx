
import React, { useState } from 'react';
import { Domain, ThinkingStep } from '../types';
import { evaluateDomainExpertAI, checkTrademarkRiskAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  onInspectDomain?: (domain: Domain) => void;
}

const EvaluationDashboard: React.FC<Props> = ({ domains, setDomains, addLog, onInspectDomain }) => {
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [activeAnalysis, setActiveAnalysis] = useState<any>(null);
  const [liveSteps, setLiveSteps] = useState<ThinkingStep[]>([]);

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    setLiveSteps([
      { id: '1', action: 'Grounded Research', finding: 'Connecting to Market APIs...', status: 'searching' },
      { id: '2', action: 'History Scrubbing', finding: 'Scanning Archive.org fingerprints...', status: 'pending' },
      { id: '3', action: 'Risk Modeling', finding: 'Analyzing trademark risk factors...', status: 'pending' }
    ]);

    addLog('Appraiser', `بدء التقييم الاستثماري المعمق للنطاق: ${domain.name}`);
    
    const [result, tmResult] = await Promise.all([
      evaluateDomainExpertAI(domain.name),
      checkTrademarkRiskAI(domain.name)
    ]);
    
    if (result) {
      setLiveSteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
      setActiveAnalysis(result);
      
      setDomains(prev => prev.map(d => d.id === domain.id ? {
        ...d,
        sector: result.sector,
        probability: result.probability,
        justification: result.justification,
        thinkingPath: result.thinkingPath,
        technicalMetrics: {
          ...result.technicalMetrics,
          trademarkRisk: tmResult
        }
      } : d));
      
      addLog('Appraiser', `انتهى التدقيق. درجة السيولة: ${result.technicalMetrics?.liquidityScore}%`, 'success');
    }
    setEvaluatingId(null);
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      <div className="bg-[#0b0e14] rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden text-right border border-white/5">
        <div className="relative z-10">
          <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">وحدة الاستدلال والتقييم المؤسسي</h3>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed mr-0 ml-auto font-medium">
            المستشار يستخدم الآن منطق <span className="text-indigo-400">Deep Reasoning</span> لربط الفرصة بالواقع التجاري والقانوني.
          </p>
        </div>
        <i className="fas fa-microchip absolute left-[-20px] top-[-20px] opacity-10 text-[220px]"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[40px] border shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">إجمالي الأصول: {domains.length}</span>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">الأصول المنتظرة في الطابور</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-right text-sm">
              <tbody className="divide-y divide-slate-100">
                {domains.map(domain => (
                  <tr key={domain.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 text-lg">{domain.name}</div>
                      <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || 'غير مصنف'}</div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex gap-4 items-center justify-end">
                          <div className="text-right">
                             <div className="text-[8px] font-black text-slate-400 uppercase">قوة الفرصة</div>
                             <div className="text-sm font-black text-slate-700">{(domain.probability || 0) * 100}%</div>
                          </div>
                          <button 
                            onClick={() => handleEvaluate(domain)}
                            disabled={evaluatingId === domain.id}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-lg"
                          >
                            {evaluatingId === domain.id ? <i className="fas fa-cog fa-spin"></i> : 'تدقيق شامل'}
                          </button>
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
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 text-right">محطة الاستدلال الحي (Reasoning Console)</h4>
              <div className="flex-1 overflow-y-auto space-y-4 font-mono scrollbar-hide text-right">
                 {liveSteps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                       <i className="fas fa-terminal text-4xl mb-4"></i>
                       <p className="text-[10px] uppercase tracking-[0.3em]">Awaiting Analysis Signal...</p>
                    </div>
                 ) : liveSteps.map(step => (
                    <div key={step.id} className="border-r-2 border-indigo-500 pr-4 py-1">
                       <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-black uppercase ${step.status === 'complete' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                             {step.status === 'complete' ? '[PASSED]' : '[EXECUTING]'}
                          </span>
                          <span className="text-white font-black text-[10px]">{step.action}</span>
                       </div>
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[40px] border shadow-sm p-10 flex-1 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 text-right">التقرير الاستثماري النهائي</h4>
              {activeAnalysis ? (
                 <div className="space-y-6 text-right animate-fade-in">
                    <div className="bg-slate-50 p-6 rounded-3xl border">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-2 text-right">درجة السيولة (Liquidity Score)</div>
                       <div className="flex items-center gap-4 justify-end">
                          <div className="text-3xl font-black text-slate-900">{activeAnalysis.technicalMetrics?.liquidityScore}%</div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden max-w-[100px]">
                             <div className="bg-indigo-600 h-full" style={{ width: `${activeAnalysis.technicalMetrics?.liquidityScore}%` }}></div>
                          </div>
                       </div>
                    </div>
                    <div>
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-2 text-right">المنطق الاستراتيجي</div>
                       <p className="text-xs text-slate-600 leading-relaxed font-medium italic border-r-2 border-indigo-500 pr-4">
                          "{activeAnalysis.justification}"
                       </p>
                    </div>
                    <div className="pt-4 border-t">
                       <div className="text-[8px] font-black text-slate-400 uppercase mb-3">سلسلة التفكير (Thinking Path)</div>
                       <p className="text-[10px] text-slate-500 font-mono leading-relaxed h-20 overflow-y-auto pr-2">
                          {activeAnalysis.thinkingPath}
                       </p>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-20">
                    <i className="fas fa-file-contract text-7xl"></i>
                    <p className="mt-4 text-[10px] uppercase font-black">انتظار بدء التدقيق</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
