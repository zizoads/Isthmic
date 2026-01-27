
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

  const netProfitTotal = useMemo(() => {
    return domains.reduce((acc, d) => acc + (d.financials?.netProfit || 0), 0);
  }, [domains]);

  const equityData = [
    { name: 'Q1', value: 20000 },
    { name: 'Q2', value: 45000 },
    { name: 'Q3', value: 68000 },
    { name: 'Q4', value: stats.estimatedPortfolioValue },
  ];

  const sectorDistribution = Array.from(new Set(domains.map(d => d.sector || t.uncategorized))).map(s => ({
    name: s,
    value: domains.filter(d => d.sector === s).length
  }));

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981'];

  return (
    <div className="space-y-12 animate-fade-in pb-20 max-w-6xl mx-auto font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 bg-[#05070a] text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden border border-white/10">
        <div className={lang === 'ar' ? 'text-right relative z-10' : 'text-left relative z-10'}>
           <h2 className="text-4xl lg:text-5xl font-black tracking-tighter uppercase italic">{t.executiveMemo}</h2>
           <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.5em] mt-3 flex items-center gap-3">
             <i className="fas fa-shield-check"></i> {t.docId}: IST-NET-{Math.random().toString(36).substr(2, 6).toUpperCase()}
           </p>
        </div>
        <div className="flex gap-4 relative z-10">
           <button 
            onClick={handleGenerateReport}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-12 py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 flex items-center gap-4"
           >
             {isLoading ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-dna"></i> {t.reSynthesize}</>}
           </button>
        </div>
        <i className="fas fa-chess-king absolute right-[-50px] bottom-[-50px] text-white/5 text-[300px] pointer-events-none -rotate-12"></i>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'الربح الصافي المتوقع', labelEn: 'ESTIMATED NET PROFIT', value: `$${netProfitTotal.toLocaleString()}`, icon: 'fa-dollar-sign', color: 'green' },
          { label: 'إجمالي المحفظة', labelEn: 'PORTFOLIO NAV', value: `$${stats.estimatedPortfolioValue.toLocaleString()}`, icon: 'fa-chart-pie', color: 'indigo' },
          { label: 'متوسط العائد (ROI)', labelEn: 'AVG ROI', value: `${stats.avgProfit}%`, icon: 'fa-rocket', color: 'green' },
          { label: 'الأصول النشطة', labelEn: 'ACTIVE ASSETS', value: domains.length, icon: 'fa-box-archive', color: 'blue' },
        ].map((item, i) => (
          <div key={i} className="bg-[#0b0e14] border border-white/10 p-8 rounded-[40px] shadow-sm flex flex-col justify-between h-44 hover:shadow-xl transition-all group">
             <div className={`flex justify-between items-center ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                <div className={`text-[10px] font-black text-slate-400 uppercase tracking-widest ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  {lang === 'ar' ? item.label : item.labelEn}
                </div>
                <i className={`fas ${item.icon} text-slate-700 group-hover:text-indigo-400 transition-colors`}></i>
             </div>
             <div className={`text-4xl font-black text-white tracking-tighter ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{item.value}</div>
             <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-2/3"></div>
             </div>
          </div>
        ))}
      </div>

      {!report && !isLoading ? (
        <div className="bg-[#0b0e14]/50 border-2 border-dashed border-white/10 rounded-[60px] py-40 flex flex-col items-center justify-center text-slate-700">
           <div className="w-24 h-24 bg-[#0b0e14] rounded-full flex items-center justify-center mb-8 shadow-inner border border-white/5">
              <i className="fas fa-signature text-5xl opacity-20"></i>
           </div>
           <p className="text-xl font-black uppercase tracking-[0.4em]">{t.awaitingSignal}</p>
        </div>
      ) : isLoading ? (
        <div className="bg-[#0b0e14] border border-white/10 rounded-[60px] p-24 flex flex-col items-center justify-center space-y-10">
           <div className="relative">
              <div className="w-32 h-32 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <i className="fas fa-brain absolute inset-0 flex items-center justify-center text-indigo-500 text-3xl"></i>
           </div>
           <div className="text-center">
             <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 animate-pulse">{t.scanningRegistrars}</p>
             <p className="text-sm text-slate-500 mt-4 italic font-medium">Calculating Net Exit Strategies...</p>
           </div>
        </div>
      ) : report && (
        <div className="space-y-12 animate-slide-up">
           <div className="bg-[#0b0e14] p-14 lg:p-20 rounded-[60px] shadow-2xl relative overflow-hidden border border-white/10">
              <div className="relative z-10">
                 <div className={`flex items-center gap-4 mb-12 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="h-0.5 w-12 bg-indigo-500"></div>
                    <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.4em]">{t.executiveNarrative}</h3>
                 </div>
                 
                 <p className={`text-3xl lg:text-4xl font-medium leading-relaxed italic text-white mb-16 ${lang === 'ar' ? 'text-right border-r-8 border-indigo-500/20 pr-12' : 'text-left border-l-8 border-indigo-500/20 pl-12'}`}>
                   "{report.summary}"
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-16 border-t border-white/10">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                       <h4 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-6">{t.strategicAllocation}</h4>
                       <p className="text-sm text-slate-400 leading-relaxed font-medium">{report.capitalEfficiency}</p>
                    </div>
                    <div className="bg-white/5 p-10 rounded-[40px] border border-white/10 flex justify-between items-center shadow-inner">
                       <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                          <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.liquidityHorizon}</div>
                          <div className="text-4xl font-black text-green-500 mt-2">{report.projections.liquidityTimeline}</div>
                       </div>
                       <div className="w-16 h-16 bg-[#0b0e14] rounded-3xl flex items-center justify-center text-3xl shadow-lg text-indigo-500 border border-white/5">
                          <i className="fas fa-calendar-check"></i>
                       </div>
                    </div>
                 </div>
              </div>
              <i className="fas fa-quote-right absolute right-[-40px] top-[-40px] text-white/5 text-[300px] pointer-events-none"></i>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-[#0b0e14] border border-white/10 p-12 rounded-[50px] shadow-sm flex flex-col items-center">
                 <h3 className={`text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10 w-full ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{t.portfolioComposition}</h3>
                 <div className="h-[320px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie 
                            data={sectorDistribution} 
                            cx="50%" 
                            cy="50%" 
                            innerRadius={70} 
                            outerRadius={110} 
                            paddingAngle={8} 
                            dataKey="value"
                            stroke="none"
                          >
                            {sectorDistribution.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                          </Pie>
                          <Tooltip contentStyle={{borderRadius: '20px', border: 'none', background: '#0b0e14', color: '#fff'}} />
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
              </div>

              <div className="lg:col-span-2 bg-[#0b0e14] border border-white/10 p-12 rounded-[50px] shadow-sm">
                 <h3 className={`text-[11px] font-black text-slate-500 uppercase tracking-widest mb-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>نمو القيمة الجنائية (Net Equity)</h3>
                 <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={equityData}>
                          <defs>
                            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10}} />
                          <YAxis hide />
                          <Tooltip contentStyle={{borderRadius: '20px', border: 'none', background: '#0b0e14', color: '#fff'}} />
                          <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={5} fill="url(#colorEquity)" />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveReportDashboard;
