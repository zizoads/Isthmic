
import React from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
}

const ForensicAuditGrid: React.FC<Props> = ({ domains }) => {
  return (
    <div className="bg-[#05070a] border border-white/10 rounded-2xl overflow-hidden font-mono text-[10px]">
      <div className="p-3 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <span className="text-red-500 font-black animate-pulse uppercase tracking-tighter">
          FORENSIC INTEGRITY RADAR
        </span>
        <div className="flex gap-4 text-slate-600">
          <span>ASSETS: {domains.length}</span>
        </div>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left border-collapse data-heavy-table">
          <thead>
            <tr className="bg-white/5 text-slate-500 uppercase border-b border-white/10">
              <th className="p-3 border-r border-white/5 font-black">ASSET</th>
              <th className="p-3 border-r border-white/5 text-center">DA/PA</th>
              <th className="p-3 border-r border-white/5 text-center">SPAM</th>
              <th className="p-3 border-r border-white/5 text-center">INTG.</th>
              <th className="p-3 border-r border-white/5 text-right">LIQUIDITY</th>
              <th className="p-3 text-right">ROI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {domains.map((d, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-3 border-r border-white/5 font-bold text-slate-300 group-hover:text-[#c5a059]">{d.name}</td>
                <td className="p-3 border-r border-white/5 text-center">
                  <span className="text-slate-400">{d.technicalMetrics?.da || '--'}</span>
                  <span className="mx-1 text-slate-700">/</span>
                  <span className="text-slate-400">{d.technicalMetrics?.pa || '--'}</span>
                </td>
                <td className="p-3 border-r border-white/5 text-center">
                   <span className={ (d.technicalMetrics?.spamScore || 0) > 10 ? 'text-red-500' : 'text-green-500'}>
                     {d.technicalMetrics?.spamScore || 0}%
                   </span>
                </td>
                <td className="p-3 border-r border-white/5 text-center">
                   <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                      <span className="text-indigo-400 font-black">{d.integrityScore || 85}%</span>
                   </div>
                </td>
                <td className="p-3 border-r border-white/5 text-right font-bold text-slate-400">
                  {d.financials?.liquidityScore || 0}/100
                </td>
                <td className="p-3 text-right font-black text-green-500">
                  +{d.financials?.projectedROI || 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ForensicAuditGrid;
