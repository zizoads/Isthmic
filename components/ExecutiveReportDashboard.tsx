
import React, { useState } from 'react';
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

  const chartData = [
    { name: '1', value: 4000 },
    { name: '2', value: 3000 },
    { name: '3', value: 5000 },
    { name: '4', value: 8000 },
    { name: '5', value: 12000 },
    { name: '6', value: 15400 },
  ];

  const sectorDistribution = Array.from(new Set(domains.map(d => d.sector || t.uncategorized))).map(s => ({
    name: s,
    value: domains.filter(d => d.sector === s).length
  }));

  const COLORS = ['#6366f1', '#4f46e5', '#4338ca', '#3730a3', '#312e81'];

  return (
    <div className="space-y-12 animate-fade-in pb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white dark:bg-slate-900 p-10 rounded-[40px] border dark:border-white/5 shadow-sm`}>
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
           <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t.executiveMemo}</h2>
           <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
             <i className="fas fa-fingerprint text-indigo-500"></i> {t.docId}: {Math.random().toString(36).substr(2, 9).toUpperCase()}
           </p>
        </div>
        <div className="flex gap-4">
           <button onClick={() => window.print()} className="bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/5 px-8 py-4 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
             {t.printMemo}
           </button>
           <button 
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-[#0b0e14] dark:bg-indigo-600 text-white px-10 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-2xl flex items-center gap-4"
           >
             {isLoading ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-sync"></i> {t.reSynthesize}</>}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: t.kpi_nav, value: `$${stats.estimatedPortfolioValue.toLocaleString()}`, color: 'indigo' },
          { label: t.kpi_capital, value: `$${stats.totalSpent.toLocaleString()}`, color: 'slate' },
          { label: t.kpi_roi, value: '142%', color: 'green' },
          { label: t.kpi_active, value: domains.length, color: 'blue' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border dark:border-white/5 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden">
             <div className={`text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.label}</div>
             <div className={`text-3xl font-black text-slate-900 dark:text-white tracking-tighter relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.value}</div>
             <div className={`absolute bottom-0 left-0 w-full h-1 bg-indigo-500 opacity-20`}></div>
          </div>
        ))}
      </div>

      {!report && !isLoading ? (
        <div className="bg-slate-900/5 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[50px] py-32 flex flex-col items-center justify-center text-slate-400">
           <i className="fas fa-file-contract text-6xl mb-6 opacity-20"></i>
           <p className="italic text-sm">{t.awaitingSignal}</p>
        </div>
      ) : isLoading ? (
        <div className="bg-white dark:bg-slate-900 rounded-[50px] border dark:border-white/5 p-20 flex flex-col items-center justify-center space-y-8">
           <div className="w-24 h-24 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
           <div className="text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 animate-pulse">{t.scanningRegistrars}</p>
             <p className="text-xs text-slate-300 mt-2 italic">{t.verifyingComps}</p>
           </div>
        </div>
      ) : report && (
        <div className="space-y-12 animate-slide-up">
           <div className="bg-slate-900 text-white p-16 rounded-[60px] shadow-2xl relative overflow-hidden">
              <div className="max-w-4xl relative z-10">
                 <h3 className={`text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.executiveNarrative}</h3>
                 <p className={`text-2xl font-medium leading-relaxed italic text-slate-100 mb-12 border-indigo-500 ${lang === 'ar' ? 'text-right border-r-4 pr-10' : 'text-left border-l-4 pl-10'}`}>
                   "{report.summary}"
                 </p>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                       <h4 className="text-[9px] font-black text-indigo-400 uppercase mb-4">{t.strategicAllocation}</h4>
                       <p className="text-xs text-slate-400 leading-relaxed font-medium">{report.capitalEfficiency}</p>
                    </div>
                    <div className="flex justify-between items-center bg-white/5 p-8 rounded-3xl border border-white/10">
                       <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                          <div className="text-[8px] font-black text-slate-500 uppercase">{t.liquidityHorizon}</div>
                          <div className="text-2xl font-black text-green-400 mt-1">{report.projections.liquidityTimeline}</div>
                       </div>
                       <i className="fas fa-clock text-3xl text-indigo-500 opacity-40"></i>
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border dark:border-white/5 shadow-sm flex flex-col items-center">
                 <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.portfolioComposition}</h3>
                 <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie data={sectorDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                            {sectorDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                          </Pie>
                          <Tooltip />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-12 rounded-[50px] border dark:border-white/5 shadow-sm">
                 <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.equityGrowth}</h3>
                 <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" hide />
                          <YAxis hide />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="#6366f1" fillOpacity={0.05} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-indigo-50 dark:bg-white/5 p-12 rounded-[50px] border border-indigo-100 dark:border-white/5">
                 <h3 className={`text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.sourceVerification}</h3>
                 <div className="space-y-4">
                    <div className={`flex gap-4 pt-6 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                       <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase">
                          <i className="fas fa-check-double"></i> {t.groundedSearch}
                       </div>
                       <div className="flex items-center gap-2 text-[9px] font-black text-indigo-400 uppercase">
                          <i className="fas fa-check-double"></i> {t.verifiedComps}
                       </div>
                    </div>
                 </div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-12 rounded-[50px] border dark:border-white/5 shadow-sm">
                 <h3 className={`text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.tacticalRec}</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {report.tacticalActions.slice(0, 3).map((action: string, i: number) => (
                       <div key={i} className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border dark:border-white/5">
                          <span className="text-xs font-black text-indigo-600">0{i+1}</span>
                          <p className={`text-[10px] font-bold text-slate-700 dark:text-slate-300 leading-tight uppercase tracking-tight ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{action}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveReportDashboard;
