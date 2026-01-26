
import React, { useState } from 'react';
import { Domain } from '../types';
// Removed getComparableSalesAI as it is not exported by geminiService and not used in this component
import { evaluateDomainAI, checkTrademarkRiskAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const EvaluationDashboard: React.FC<Props> = ({ domains, setDomains, addLog }) => {
  const [evaluatingId, setEvaluatingId] = useState<string | null>(null);
  const [tmRisk, setTmRisk] = useState<Record<string, string>>({});

  const handleEvaluate = async (domain: Domain) => {
    setEvaluatingId(domain.id);
    addLog('Evaluation', `Deep Tactical Audit for ${domain.name} initiated...`);
    
    // 1. تقييم استراتيجي + علامة تجارية
    const [result, tmResult] = await Promise.all([
      evaluateDomainAI(domain.name),
      checkTrademarkRiskAI(domain.name)
    ]);
    
    setTmRisk(prev => ({ ...prev, [domain.id]: tmResult }));

    if (result) {
      setDomains(prev => prev.map(d => d.id === domain.id ? {
        ...d,
        sector: result.sector,
        probability: result.probability,
        justification: result.justification,
        technicalMetrics: {
          ...result.technicalMetrics,
          trademarkRisk: tmResult.toLowerCase().includes('high') ? 'High' : 'Low'
        }
      } : d));
      
      addLog('Evaluation', `${domain.name}: Audit Ready. Risk: ${tmResult.substring(0, 30)}...`, 'success');
    }
    setEvaluatingId(null);
  };

  return (
    <div className="space-y-10">
      <div className="bg-[#0b0e14] rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
        <h3 className="text-3xl font-black tracking-tighter uppercase mb-4">Risk & Valuation Center</h3>
        <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
          Every asset is cross-referenced with <span className="text-indigo-400">USPTO databases</span> and <span className="text-indigo-400">global sales history</span>. 
          We eliminate the guesswork in digital asset investment.
        </p>
        <div className="absolute right-[-20px] top-[-20px] opacity-10 text-[180px]">
           <i className="fas fa-shield-alt"></i>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Asset</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">IP Risk Audit</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Liquidity Pulse</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.map(domain => (
                <tr key={domain.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="font-black text-slate-900 text-lg">{domain.name}</div>
                    <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector || 'Uncategorized'}</div>
                  </td>
                  <td className="px-10 py-8">
                    {tmRisk[domain.id] ? (
                      <div className="flex flex-col gap-2">
                         <div className={`text-[10px] font-black uppercase flex items-center gap-2 ${tmRisk[domain.id].toLowerCase().includes('high') ? 'text-red-500' : 'text-green-500'}`}>
                            <i className="fas fa-circle text-[6px]"></i> {tmRisk[domain.id].substring(0, 50)}...
                         </div>
                      </div>
                    ) : <span className="text-slate-300">Pending IP Scan...</span>}
                  </td>
                  <td className="px-10 py-8">
                    {domain.technicalMetrics?.liquidityScore ? (
                       <div className="text-xl font-black text-slate-800">{domain.technicalMetrics.liquidityScore}/10</div>
                    ) : '--'}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <button 
                      onClick={() => handleEvaluate(domain)}
                      disabled={evaluatingId === domain.id}
                      className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-200 transition-all shadow-xl shadow-slate-100"
                    >
                      {evaluatingId === domain.id ? <i className="fas fa-spinner fa-spin"></i> : 'Execute Deep Audit'}
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
