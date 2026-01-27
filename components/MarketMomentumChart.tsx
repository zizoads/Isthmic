
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  lang: 'ar' | 'en';
}

const MarketMomentumChart: React.FC<Props> = ({ lang }) => {
  const data = [
    { time: '00:00', price: 4000, vol: 2400 },
    { time: '04:00', price: 3000, vol: 1398 },
    { time: '08:00', price: 2000, vol: 9800 },
    { time: '12:00', price: 2780, vol: 3908 },
    { time: '16:00', price: 1890, vol: 4800 },
    { time: '20:00', price: 2390, vol: 3800 },
    { time: '23:59', price: 3490, vol: 4300 },
  ];

  return (
    <div className="bg-[#0b0e14] border border-white/5 rounded-[32px] p-8 shadow-2xl h-[500px] flex flex-col group relative overflow-hidden">
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">
            {lang === 'ar' ? 'رادار زخم السوق الفني' : 'Technical Market Momentum'}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-2xl font-black text-white tracking-tighter">AI SECTOR INDEX</span>
            <span className="text-green-500 text-xs font-black">+14.2%</span>
          </div>
        </div>
        <div className="flex gap-2">
          {['1H', '4H', '1D', '1W'].map(t => (
            <button key={t} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 hover:text-white transition-all">{t}</button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorMomentum" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#475569', fontSize: 10, fontWeight: 900}} />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: '#0b0e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              itemStyle={{ color: '#6366f1', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
            />
            <Area 
              type="monotone" 
              dataKey="vol" 
              stroke="#6366f1" 
              strokeWidth={4} 
              fillOpacity={1} 
              fill="url(#colorMomentum)" 
              animationDuration={2000}
            />
            <ReferenceLine y={5000} label="Liquidity Peak" stroke="#22c55e" strokeDasharray="3 3" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4 opacity-50 relative z-10">
         <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase">RSI (14)</span>
              <span className="text-xs font-black text-white">64.20</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-500 uppercase">MACD</span>
              <span className="text-xs font-black text-green-500">BULLISH</span>
            </div>
         </div>
         <div className="text-[9px] font-mono text-slate-600">ENGINE: V3_DEEP_ANALYTICS</div>
      </div>
      
      <i className="fas fa-wave-square absolute right-[-40px] top-[-40px] text-white/5 text-[200px] pointer-events-none"></i>
    </div>
  );
};

export default MarketMomentumChart;
