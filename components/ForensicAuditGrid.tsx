
import React from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  lang: 'ar' | 'en';
}

const ForensicAuditGrid: React.FC<Props> = ({ domains, lang }) => {
  return (
    <div className="bg-[#05070a] border border-white/10 rounded-2xl overflow-hidden font-mono text-[11px]">
      <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
        <span className="text-red-500 font-black animate-pulse uppercase tracking-tighter">
          {lang === 'ar' ? 'ماسح المخاطر الجنائي' : 'FORENSIC RISK SCANNER'}
        </span>
        <div className="flex gap-4 text-slate-500">
          <span>{lang === 'ar' ? 'إجمالي الأصول تحت الفحص:' : 'ASSETS UNDER AUDIT:'} {domains.length}</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 text-slate-400 uppercase border-b border-white/10">
              <th className="p-4 border-r border-white/5 font-black">{lang === 'ar' ? 'النطاق' : 'DOMAIN'}</th>
              <th className="p-4 border-r border-white/5 text-center">DA/PA</th>
              <th className="p-4 border-r border-white/5 text-center">SPAM%</th>
              <th className="p-4 border-r border-white/5 text-center">TM RISK</th>
              <th className="p-4 border-r border-white/5 text-right">LIQUIDITY</th>
              <th className="p-4 text-right">ROI%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {domains.map((d, i) => (
              <tr key={i} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 border-r border-white/5 font-bold text-white group-hover:text-indigo-400">{d.name}</td>
                <td className="p-4 border-r border-white/5 text-center">
                  <span className="text-slate-300">{d.technicalMetrics?.da || '--'}</span>
                  <span className="mx-1 text-slate-600">/</span>
                  <span className="text-slate-300">{d.technicalMetrics?.pa || '--'}</span>
                </td>
                <td className="p-4 border-r border-white/5 text-center">
                   <span className={ (d.technicalMetrics?.spamScore || 0) > 10 ? 'text-red-500' : 'text-green-500'}>
                     {d.technicalMetrics?.spamScore || 0}%
                   </span>
                </td>
                <td className="p-4 border-r border-white/5 text-center">
                   <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                     d.technicalMetrics?.trademarkRisk === 'High' ? 'bg-red-500/20 text-red-500' : 
                     d.technicalMetrics?.trademarkRisk === 'Low' ? 'bg-green-500/20 text-green-500' : 'bg-slate-700 text-slate-300'
                   }`}>
                     {d.technicalMetrics?.trademarkRisk || 'SAFE'}
                   </span>
                </td>
                <td className="p-4 border-r border-white/5 text-right font-bold text-indigo-400">
                  {d.financials?.liquidityScore || 0}/100
                </td>
                <td className="p-4 text-right font-black text-green-500">
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
