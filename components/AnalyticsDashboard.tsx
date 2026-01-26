
import React from 'react';
import { PlatformStats } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

interface Props {
  stats: PlatformStats;
  isLearningView?: boolean;
}

const AnalyticsDashboard: React.FC<Props> = ({ stats, isLearningView }) => {
  const chartData = [
    { name: 'Mon', domains: 12, sales: 2 },
    { name: 'Tue', domains: 18, sales: 5 },
    { name: 'Wed', domains: 15, sales: 3 },
    { name: 'Thu', domains: 25, sales: 8 },
    { name: 'Fri', domains: 32, sales: 12 },
    { name: 'Sat', domains: 10, sales: 4 },
    { name: 'Sun', domains: 8, sales: 2 },
  ];

  const sectorData = [
    { name: 'Tech', value: 45 },
    { name: 'Fin', value: 30 },
    { name: 'Health', value: 15 },
    { name: 'Crypto', value: 10 },
  ];

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316'];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Domains Found', value: stats.totalDiscovered, icon: 'fa-search', color: 'indigo' },
          { label: 'Success Rate', value: `${stats.openRate}%`, icon: 'fa-chart-line', color: 'green' },
          { label: 'Outreach Sent', value: stats.messagesSent, icon: 'fa-paper-plane', color: 'blue' },
          { label: 'Avg Profit', value: `${stats.avgProfit}%`, icon: 'fa-dollar-sign', color: 'orange' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-xl flex items-center justify-center text-xl`}>
              <i className={`fas ${item.icon}`}></i>
            </div>
            <div>
              <div className="text-slate-400 text-xs font-bold uppercase">{item.label}</div>
              <div className="text-2xl font-bold text-slate-800">{item.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border shadow-sm h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Master Brain Performance Scan</h3>
            <div className="flex gap-2 text-xs">
              <button className="px-3 py-1 bg-slate-100 rounded-full font-bold">Week</button>
              <button className="px-3 py-1 hover:bg-slate-50 rounded-full font-bold text-slate-400">Month</button>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDomains" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="domains" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDomains)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sector Mix */}
        <div className="bg-white p-8 rounded-xl border shadow-sm h-[400px] flex flex-col">
          <h3 className="font-bold text-slate-800 mb-6">Market Sector Mix</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
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
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{backgroundColor: COLORS[i]}}></div>
                <span className="text-xs text-slate-500">{s.name} ({s.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLearningView && (
        <div className="bg-indigo-900 rounded-xl p-8 text-white">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 space-y-4">
              <h3 className="text-2xl font-bold">Feedback Learning Agent</h3>
              <p className="text-indigo-200 leading-relaxed">
                The agent is currently adjusting weights based on your 12 recent purchases. 
                Evaluation accuracy for <span className="text-white font-bold">"SaaS Tech"</span> domains has increased by 14% after analyzing your selection patterns.
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-indigo-900 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                  View Logic Updates
                </button>
                <button className="border border-indigo-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-800 transition-colors">
                  Export Dataset
                </button>
              </div>
            </div>
            <div className="w-48 h-48 rounded-full border-8 border-indigo-800 flex items-center justify-center relative">
               <div className="text-center">
                 <div className="text-3xl font-bold">94%</div>
                 <div className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Confidence</div>
               </div>
               <div className="absolute top-[-10px] left-1/2 -translate-x-1/2 bg-green-500 text-[10px] px-2 py-0.5 rounded-full font-bold">Optimizing</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
