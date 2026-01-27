
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { analyzeMarketPulseAI } from '../services/geminiService';

interface Props {
  lang: 'ar' | 'en';
}

const MarketMomentumChart: React.FC<Props> = ({ lang }) => {
  const [pulse, setPulse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [targetSector, setTargetSector] = useState('Artificial Intelligence');

  useEffect(() => {
    handleFetchPulse();
  }, []);

  const handleFetchPulse = async () => {
    setIsLoading(true);
    const data = await analyzeMarketPulseAI(targetSector, lang);
    setPulse(data);
    setIsLoading(false);
  };

  const chartData = pulse?.recentComps?.map((comp: any, i: number) => ({
    time: i.toString(),
    price: comp.price,
    domain: comp.domain
  })) || [
    { time: '0', price: 4000 },
    { time: '1', price: 3000 },
    { time: '2', price: 7000 },
    { time: '3', price: 4500 },
  ];

  return (
    <div className="bg-[#0b0e14] border border-white/10 rounded-[40px] p-8 lg:p-12 shadow-2xl h-auto min-h-[600px] flex flex-col group relative overflow-hidden">
      <div className={`flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-12 relative z-10 ${lang === 'ar' ? 'lg:flex-row-reverse' : ''}`}>
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-3">
            {lang === 'ar' ? 'رادار الزخم الحي الموثق' : 'GROUNDED LIVE MOMENTUM RADAR'}
          </h3>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase">{targetSector} Index</span>
            <span className={`text-sm font-black px-3 py-1 rounded-full ${pulse?.sentiment === 'BULLISH' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
              {pulse?.sentiment || 'ANALYZING...'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-3 w-full lg:w-auto">
          <input 
            value={targetSector}
            onChange={(e) => setTargetSector(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-indigo-500/50"
            placeholder="Change Sector..."
          />
          <button 
            onClick={handleFetchPulse}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-white hover:text-indigo-600 transition-all"
          >
            {isLoading ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-satellite-dish"></i>}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-[300px] relative z-10 mb-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPulse" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis hide />
            <YAxis hide />
            <Tooltip 
              contentStyle={{ background: '#0b0e14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
              itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900' }}
              labelStyle={{ display: 'none' }}
              formatter={(value: any, name: any, props: any) => [`$${value.toLocaleString()}`, props.payload.domain || 'Valuation']}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#6366f1" 
              strokeWidth={5} 
              fillOpacity={1} 
              fill="url(#colorPulse)" 
              animationDuration={2500}
            />
            {pulse?.heatScore > 70 && <ReferenceLine y={8000} label="Sector Heat Spike" stroke="#ef4444" strokeDasharray="3 3" />}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {pulse && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10 border-t border-white/5 pt-10">
           <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">{lang === 'ar' ? 'التوصية الاستراتيجية' : 'STRATEGIC RECOMMENDATION'}</h4>
              <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                "{pulse.strategicAdvice}"
              </p>
           </div>
           <div className="bg-white/5 p-6 rounded-3xl border border-white/10 flex justify-between items-center">
              <div>
                 <div className="text-[9px] font-black text-indigo-400 uppercase">Sector Heat Score</div>
                 <div className="text-4xl font-black text-white mt-1">{pulse.heatScore}%</div>
              </div>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${pulse.heatScore > 75 ? 'bg-red-500 text-white animate-pulse' : 'bg-indigo-600 text-white'}`}>
                 <i className={`fas ${pulse.heatScore > 75 ? 'fa-fire' : 'fa-bolt'}`}></i>
              </div>
           </div>
        </div>
      )}
      
      <i className="fas fa-chart-line absolute right-[-50px] bottom-[-50px] text-white/2 text-[300px] pointer-events-none -rotate-12"></i>
    </div>
  );
};

export default MarketMomentumChart;
