
import React, { useState } from 'react';
import { Domain, ThinkingStep } from '../types';
import { evaluateDomainAI, checkTrademarkRiskAI } from '../services/geminiService';

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
      { id: '1', action: 'Initializing Search Agent', finding: 'Connecting to Google Search Grounding...', status: 'complete' },
      { id: '2', action: 'Analyzing Historical Sales', finding: 'Querying NameBio & Afternic APIs...', status: 'searching' }
    ]);

    addLog('Evaluation', `Executing Deep Audit for ${domain.name}...`);
    
    const [result, tmResult] = await Promise.all([
      evaluateDomainAI(domain.name),
      checkTrademarkRiskAI(domain.name)
    ]);
    
    if (result) {
      setLiveSteps(prev => [
        ...prev.map(s => ({ ...s, status: 'complete' as const })),
        { id: '3', action: 'IP Risk Assessment', finding: tmResult.substring(0, 100), status: 'complete' },
        { id: '4', action: 'Final Appraisal', finding: `Score: ${result.probability * 100}%`, status: 'complete' }
      ]);

      setActiveAnalysis(result);
      setDomains(prev => prev.map(d => d.id === domain.id ? {
        ...d,
        sector: result.sector,
        probability: result.probability,
        justification: result.justification,
        thinkingPath: result.thinkingPath,
        technicalMetrics: {
          ...result.technicalMetrics,
          trademarkRisk: tmResult.toLowerCase().includes('high') ? 'High' : 'Low'
        }
      } : d));
      
      addLog('Evaluation', `${domain.name}: Audit Finalized.`, 'success');
    }
    setEvaluatingId(null);
  };

  const openTool = (tool: 'wayback' | 'namebio' | 'godaddy' | 'trademark', domainName: string) => {
    const keyword = domainName.split('.')[0];
    const urls = {
      wayback: `https://web.archive.org/web/*/${domainName}`,
      namebio: `https://namebio.com/?s=${keyword}`,
      godaddy: `https://www.godaddy.com/domain-value-appraisal/appraisal/?domainToCheck=${domainName}`,
      trademark: `https://www.trademarkia.com/trademarks-search.aspx?tn=${keyword}`
    };
    window.open(urls[tool], '_blank');
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      <div className="bg-[#0b0e14] rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden text-right border border-white/5">
        <div className="relative z-10">
          <h3 className="text-4xl font-black tracking-tighter uppercase mb-4">وحدة الاستخبارات الميدانية</h3>
          <p className="text-slate-400 text-sm max-w-xl leading-relaxed mr-0 ml-auto font-medium">
            تكامل مباشر مع محرك <span className="text-indigo-400">Gemini 3 Pro</span> لتحليل القيمة السوقية الحقيقية والمخاطر القانونية.
          </p>
        </div>
        <div className="absolute left-[-20px] top-[-20px] opacity-10 text-[220px]">
           <i className="fas fa-microchip"></i>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Assets List */}
        <div className="lg:col-span-7 bg-white rounded-[40px] border shadow-sm overflow-hidden flex flex-col h-[750px]">
          <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Depth: {domains.length}</span>
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">قائمة الأصول تحت التدقيق</h4>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-right text-sm">
              <tbody className="divide-y divide-slate-100">
                {domains.map(domain => (
                  <tr key={domain.id} className={`hover:bg-slate-50/50 transition-all group ${activeAnalysis?.name === domain.name ? 'bg-indigo-50/50' : ''}`}>
                    <td className="px-10 py-8 text-right">
                      <div 
                        onClick={() => onInspectDomain && onInspectDomain(domain)}
                        className="font-black text-slate-900 text-lg cursor-pointer hover:text-indigo-600 transition-colors flex items-center gap-2 group/name"
                      >
                         {domain.name}
                         <i className="fas fa-external-link-alt text-[10px] opacity-0 group-hover/name:opacity-100"></i>
                      </div>
                      <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || 'Uncategorized'}</div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex gap-2 justify-end">
                         <button onClick={() => openTool('namebio', domain.name)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-green-600 hover:text-white transition-all shadow-sm"><i className="fas fa-dollar-sign text-[10px]"></i></button>
                         <button onClick={() => openTool('trademark', domain.name)} className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm"><i className="fas fa-registered text-[10px]"></i></button>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-left">
                      <button 
                        onClick={() => handleEvaluate(domain)}
                        disabled={evaluatingId === domain.id}
                        className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-lg flex items-center gap-2"
                      >
                        {evaluatingId === domain.id ? <i className="fas fa-cog fa-spin"></i> : <><i className="fas fa-microchip"></i> فحص مؤسسي</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Intelligence Console */}
        <div className="lg:col-span-5 flex flex-col gap-6">
           <div className="bg-[#0b0e14] rounded-[40px] text-white p-10 shadow-2xl flex flex-col h-[400px] border border-white/5 relative overflow-hidden">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-8 text-right">محطة الاستدلال الحي (Reasoning Terminal)</h4>
              <div className="flex-1 overflow-y-auto space-y-4 font-mono scrollbar-hide text-right">
                 {liveSteps.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center opacity-20">
                       <i className="fas fa-terminal text-4xl mb-4"></i>
                       <p className="text-[10px] uppercase">Awaiting Task Initiation...</p>
                    </div>
                 ) : liveSteps.map(step => (
                    <div key={step.id} className="border-r-2 border-indigo-500 pr-4 py-1">
                       <div className="flex justify-between items-center mb-1">
                          <span className={`text-[9px] font-black uppercase ${step.status === 'complete' ? 'text-green-500' : 'text-amber-500 animate-pulse'}`}>
                             {step.status === 'complete' ? '[DONE]' : '[SEARCHING]'}
                          </span>
                          <span className="text-white font-black text-[10px]">{step.action}</span>
                       </div>
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">{step.finding}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="bg-white rounded-[40px] border shadow-sm p-10 flex-1 flex flex-col">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 text-right">الخلاصة الاستراتيجية</h4>
              {activeAnalysis ? (
                 <div className="space-y-6 text-right animate-fade-in">
                    <div className="flex justify-between items-center">
                       <div className="text-3xl font-black text-slate-900">{(activeAnalysis.probability * 100).toFixed(0)}%</div>
                       <div className="text-[10px] font-black text-slate-400 uppercase">Confidence Score</div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium italic border-r-2 border-indigo-500 pr-4">
                       "{activeAnalysis.justification}"
                    </p>
                    <div className="bg-slate-50 p-6 rounded-3xl border">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-2">Deep Insights (Thinking Path)</div>
                       <div className="text-[10px] text-slate-500 leading-relaxed max-h-32 overflow-y-auto">
                          {activeAnalysis.thinkingPath}
                       </div>
                    </div>
                 </div>
              ) : (
                 <div className="flex-1 flex flex-col items-center justify-center text-slate-300 opacity-20">
                    <i className="fas fa-brain text-7xl"></i>
                 </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
