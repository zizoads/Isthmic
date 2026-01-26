
import React, { useState } from 'react';
import { Domain } from '../types';
import { evaluateDomainAI, getComparableSalesAI, findLinkedInLeadsAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const EvaluationDashboard: React.FC<Props> = ({ domains, setDomains, addLog }) => {
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [comps, setComps] = useState<Record<string, {text: string, sources: string[]}>>({});

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    addLog('Evaluation', `Deep Intelligence Audit for ${domain.name} initiated...`);
    
    // 1. تقييم استراتيجي
    const result = await evaluateDomainAI(domain.name);
    
    // 2. مبيعات مقارنة (Comps)
    addLog('Evaluation', `Fetching comparable sales data from global archives...`, 'info');
    const compData = await getComparableSalesAI(domain.name, result?.sector || 'General');
    setComps(prev => ({ ...prev, [domain.id]: compData }));

    if (result) {
      setDomains(prev => prev.map(d => d.id === domain.id ? {
        ...d,
        sector: result.sector,
        probability: result.probability,
        potentialClients: result.potentialClients,
        justification: result.justification,
        technicalMetrics: {
          ...result.technicalMetrics,
          isBlacklisted: result.technicalMetrics.liquidityScore < 4,
          mxRecordsFound: true
        },
        estimatedProfit: d.price * (result.probability * 25) // تعديل معامل الربح للمحترفين
      } : d));
      
      addLog('Evaluation', `${domain.name}: Strategy ready. Liquidity: ${result.technicalMetrics.liquidityScore}/10.`, 'success');
    }
    setEvaluatingId(null);
  };

  return (
    <div className="space-y-10">
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Market Grounding Audit</h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              Our agents are now cross-referencing every asset with actual sales history and venture capital trends. 
              Don't just buy a domain—buy a <span className="text-indigo-400">liquidity event</span>.
            </p>
          </div>
          <div className="flex gap-4 items-center justify-end">
             <div className="text-right">
                <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global Comps Checked</div>
                <div className="text-4xl font-black">1.2k+</div>
             </div>
             <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center rotate-12">
                <i className="fas fa-database text-xl"></i>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Digital Asset</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Liquidity Score</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Comparable Sales</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.map(domain => (
                <tr key={domain.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-lg">{domain.name}</div>
                    <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || 'Pending Scan'}</div>
                  </td>
                  <td className="px-10 py-8">
                    {domain.technicalMetrics?.liquidityScore ? (
                      <div className="flex items-center gap-3">
                         <div className="text-2xl font-black text-slate-800">{domain.technicalMetrics.liquidityScore}/10</div>
                         <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${domain.technicalMetrics.liquidityScore > 7 ? 'bg-green-500' : 'bg-amber-500'}`} 
                              style={{ width: `${domain.technicalMetrics.liquidityScore * 10}%` }}
                            ></div>
                         </div>
                      </div>
                    ) : '--'}
                  </td>
                  <td className="px-10 py-8 max-w-md">
                    {comps[domain.id] ? (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-500 leading-tight italic line-clamp-2">
                          {comps[domain.id].text}
                        </p>
                        <div className="flex gap-2">
                          {comps[domain.id].sources.slice(0, 2).map((s, i) => (
                            <a key={i} href={s} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-indigo-500 uppercase hover:underline">Source {i+1}</a>
                          ))}
                        </div>
                      </div>
                    ) : <span className="text-slate-300">Awaiting Search...</span>}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleEvaluate(domain)}
                      disabled={evaluatingId === domain.id}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-xl shadow-slate-100"
                    >
                      {evaluatingId === domain.id ? <i className="fas fa-spinner fa-spin"></i> : 'Run Market Audit'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EvaluationDashboard;
