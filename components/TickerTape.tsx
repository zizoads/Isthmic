
import React from 'react';

interface Props {
  lang: 'ar' | 'en';
}

const TickerTape: React.FC<Props> = ({ lang }) => {
  const simulatedSales = [
    { name: 'AI.com', price: '11M', trend: 'up' },
    { name: 'Health.io', price: '150K', trend: 'up' },
    { name: 'Meta.shop', price: '12K', trend: 'down' },
    { name: 'Cloud.tech', price: '85K', trend: 'up' },
    { name: 'Bio.net', price: '42K', trend: 'stable' },
    { name: 'Cyber.security', price: '200K', trend: 'up' },
    { name: 'Dubai.estate', price: '300K', trend: 'up' },
    { name: 'Fast.delivery', price: '18K', trend: 'down' },
    { name: 'Crypto.bank', price: '1.2M', trend: 'up' },
    { name: 'Luxury.villas', price: '45K', trend: 'stable' },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#05070a]/90 backdrop-blur-md border-t border-white/10 h-10 flex items-center overflow-hidden z-[1000] select-none font-mono">
      <div className="bg-indigo-600 px-6 h-full flex items-center text-[10px] font-black uppercase tracking-widest text-white z-20 shadow-[10px_0_20px_rgba(0,0,0,0.5)] border-r border-white/10">
        <i className="fas fa-globe-americas mr-2 animate-spin-slow"></i>
        {lang === 'ar' ? 'نبض السوق العالمي' : 'GLOBAL MARKET PULSE'}
      </div>
      <div className="flex whitespace-nowrap animate-ticker items-center">
        {[...simulatedSales, ...simulatedSales].map((sale, i) => (
          <div key={i} className="flex items-center gap-3 px-10 border-r border-white/5 group cursor-default">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter group-hover:text-white transition-colors">{sale.name}</span>
            <span className="text-white text-[11px] font-black tabular-nums">${sale.price}</span>
            <span className={`flex items-center gap-1 text-[9px] font-black ${
              sale.trend === 'up' ? 'text-green-500' : sale.trend === 'down' ? 'text-red-500' : 'text-slate-500'
            }`}>
              <i className={`fas fa-caret-${sale.trend === 'up' ? 'up' : sale.trend === 'down' ? 'down' : 'right'}`}></i>
              {sale.trend === 'up' ? '+4.2%' : sale.trend === 'down' ? '-1.8%' : '0.0%'}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 40s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TickerTape;
