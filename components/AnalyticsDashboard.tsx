
import React from 'react';
import { PlatformStats } from '../types';
import { translations } from '../translations';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface Props {
  stats: PlatformStats;
  isLearningView?: boolean;
  lang?: 'ar' | 'en';
}

const AnalyticsDashboard: React.FC<Props> = ({ stats, isLearningView, lang = 'ar' }) => {
  const t = translations[lang];

  const chartData = [
    { name: lang === 'ar' ? 'الإثنين' : 'Mon', domains: 12, sales: 2 },
    { name: lang === 'ar' ? 'الثلاثاء' : 'Tue', domains: 18, sales: 5 },
    { name: lang === 'ar' ? 'الأربعاء' : 'Wed', domains: 15, sales: 3 },
    { name: lang === 'ar' ? 'الخميس' : 'Thu', domains: 25, sales: 8 },
    { name: lang === 'ar' ? 'الجمعة' : 'Fri', domains: 32, sales: 12 },
    { name: lang === 'ar' ? 'السبت' : 'Sat', domains: 10, sales: 4 },
    { name: lang === 'ar' ? 'الأحد' : 'Sun', domains: 8, sales: 2 },
  ];

  const sectorData = [
    { name: t.tech, value: 45 },
    { name: t.fin, value: 30 },
    { name: t.health, value: 15 },
    { name: t.crypto, value: 10 },
  ];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

  return (
    <div className="space-y-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t.domainsFound, value: stats.totalDiscovered, icon: 'fa-search', color: 'indigo' },
          { label: t.successRate, value: `${stats.openRate}%`, icon: 'fa-chart-line', color: 'green' },
          { label: t.outreachSent, value: stats.messagesSent, icon: 'fa-paper-plane', color: 'blue' },
          { label: t.avgProfit, value: `${stats.avgProfit}%`, icon: 'fa-dollar-sign', color: 'orange' },
        ].map((item, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-xl border dark:border-white/5 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-xl flex items-center justify-center text-xl`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{item.label}</div>
              <div className="text-2xl font-black text-slate-800 dark:text-white">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-white/5 shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-tighter">{t.performanceScan}</h3>
            <div className="flex gap-2 text-[9px] font-black uppercase tracking-widest">
              <button className="px-3 py-1 bg-slate-100 dark:bg-white/5 rounded-full">{t.week}</button>
              <button className="px-3 py-1 text-slate-400 hover:text-indigo-500">{t.month}</button>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDomains" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} orientation={lang === 'ar' ? 'right' : 'left'} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '10px'}}
                />
                <Area type="monotone" dataKey="domains" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDomains)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Mix */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-xl border dark:border-white/5 shadow-sm h-[400px] flex flex-col">
          <h3 className="font-black text-slate-800 dark:text-white uppercase text-xs tracking-tighter mb-6">{t.marketMix}</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {sectorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {sectorData.map((s, i) => (
              <div key={i} className={`flex items-center gap-2 ${lang === 'ar' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                <span className="text-[10px] font-bold text-slate-500">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
