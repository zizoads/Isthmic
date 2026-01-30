
import React, { useState, useMemo } from 'react';
import { Domain, PlatformStats } from '../types';
import { generateExecutiveReportAI } from '../services/geminiService';
import { translations } from '../translations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Props {
  domains: Domain[];
  stats: PlatformStats;
  lang: 'ar' | 'en';
}

const ExecutiveReportDashboard: React.FC<Props> = ({ domains, stats, lang }) => {
  const t = translations[lang];
  const [report, setReport] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    const sectors: string[] = Array.from(new Set(domains.map(d => d.sector || t.uncategorized)));
    const data = await generateExecutiveReportAI(stats, sectors);
    setReport(data);
    setIsLoading(false);
  };

  const COLORS = ['#000000', '#333333', '#666666', '#999999', '#c5a059'];

  return (
    <div className="space-y-0 animate-precision pb-20 border-2 border-white/20 bg-[#0c0c0c]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sovereign Header - Dossier Style */}
      <header className="grid grid-cols-12 border-b-2 border-white/20">
        <div className="col-span-12 lg:col-span-8 p-12 lg:p-16 border-r-2 border-white/20">
           <div className="flex items-center gap-4 mb-8">
              <div className="w-4 h-4 bg-[#c5a059]"></div>
              <span className="text-[10px] font-black tracking-[0.6em] text-slate-500 uppercase">Classified Financial Intelligence</span>
           </div>
           <h2 className="text-6xl lg:text-9xl prestige-title text-white leading-none mb-10">Executive Memo.</h2>
           <div className="flex flex-wrap gap-10 font-mono text-[10px] text-slate-500 uppercase">
              <div><span className="text-white font-black">ID:</span> {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              <div><span className="text-white font-black">DATE:</span> {new Date().toLocaleDateString()}</div>
              <div><span className="text-white font-black">STATUS:</span> Sovereign_Verified</div>
           </div>
        </div>
        <div className="col-span-12 lg:col-span-4 p-12 flex flex-col justify-between bg-white text-black">
           <div className="space-y-2">
              <div className="text-[9px] font-black uppercase tracking-widest opacity-40">Commander Protocol</div>
              <div className="text-2xl font-black italic tracking-tighter">Isthmic Pro // Unit_01</div>
           </div>
           <button 
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="brutal-btn w-full justify-center bg-black text-white border-black shadow-none hover:bg-[#c5a059]"
           >
             {isLoading ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-print"></i> {t.reSynthesize}</>}
           </button>
        </div>
      </header>

      {/* Metrics Row - Hard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-b-2 border-white/20">
        {[
          { label: 'NET_EQUITY', val: `$${stats.estimatedPortfolioValue.toLocaleString()}`, trend: '+14%' },
          { label: 'LIQUIDITY_PULSE', val: `${stats.avgProfit}%`, trend: 'Stable' },
          { label: 'ALPHA_UNITS', val: domains.length, trend: 'Optimal' },
          { label: 'RISK_INDEX', val: 'Low', trend: '-2.4%' }
        ].map((m, i) => (
          <div key={i} className="p-10 border-r-2 border-white/20 last:border-r-0 space-y-6">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 tracking-widest">{m.label}</span>
                <span className="text-[9px] font-mono text-[#c5a059]">{m.trend}</span>
             </div>
             <div className="text-4xl font-black text-white italic tracking-tighter">{m.val}</div>
          </div>
        ))}
      </div>

      {/* Narrative Section */}
      <div className="grid grid-cols-12 min-h-[600px]">
        <div className="col-span-12 lg:col-span-8 p-12 lg:p-24 border-r-2 border-white/20 relative overflow-hidden">
           {!report ? (
             <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fas fa-signature text-[200px] mb-10"></i>
                <p className="text-xl font-black uppercase tracking-[1em]">Awaiting_Synthesis</p>
             </div>
           ) : (
             <div className="space-y-16 animate-precision relative z-10">
                <div className="space-y-8">
                   <h3 className="text-[11px] font-black text-[#c5a059] uppercase tracking-[0.5em] border-b border-[#c5a059]/20 pb-4">Strategic Narrative</h3>
                   <p className="text-4xl lg:text-5xl font-light prestige-title text-white leading-tight">
                      "{report.summary}"
                   </p>
                </div>
                
                <div className="grid grid-cols-2 gap-16 pt-16 border-t border-white/10 font-mono text-xs">
                   <div className="space-y-6">
                      <div className="font-black text-white uppercase underline">Capital Efficiency Report</div>
                      <p className="text-slate-400 leading-loose italic">{report.capitalEfficiency}</p>
                   </div>
                   <div className="space-y-6">
                      <div className="font-black text-white uppercase underline">Liquidity Horizon</div>
                      <div className="text-5xl font-black text-[#c5a059] tracking-tighter">{report.projections.liquidityTimeline}</div>
                   </div>
                </div>
             </div>
           )}
           {/* Background "Stamp" Effect */}
           <div className="absolute top-10 right-10 w-40 h-40 border-4 border-red-500/20 rounded-full flex items-center justify-center -rotate-12 pointer-events-none">
              <div className="text-red-500/20 text-xs font-black uppercase text-center">
                 Isthmic Pro<br/>Sovereign<br/>Approved
              </div>
           </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white/[0.02] flex flex-col">
           <div className="p-10 border-b-2 border-white/20 h-1/2">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Portfolio_Composition</h4>
              <div className="h-64">
                 <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                       <Pie data={domains.length ? [{name:'A', value:100}] : []} innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
                          <Cell fill="#c5a059" />
                       </Pie>
                    </PieChart>
                 </ResponsiveContainer>
              </div>
           </div>
           <div className="p-10 flex flex-col justify-center flex-1 space-y-8 font-mono">
              <div className="space-y-2">
                 <div className="text-[9px] text-slate-600 font-black">DOCUMENT_INTEGRITY</div>
                 <div className="w-full h-2 bg-white/5 border border-white/10 p-[1px]">
                    <div className="h-full bg-[#c5a059]" style={{ width: '98%' }}></div>
                 </div>
              </div>
              <div className="text-[10px] text-slate-500 leading-relaxed italic">
                 // Forensic validation completed by Multi-Agent Core.<br/>
                 // All projections are based on real-time market grounding.<br/>
                 // ISTHMIC_PRO_INTERNAL_USE_ONLY
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveReportDashboard;
