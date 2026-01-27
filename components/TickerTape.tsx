
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
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#05070a] border-t border-white/10 h-10 flex items-center overflow-hidden z-[1000] select-none font-mono">
      <div className="bg-primary px-4 h-full flex items-center text-[10px] font-black uppercase tracking-tighter text-white z-20 shadow-xl">
        {lang === 'ar' ? 'نبض السوق' : 'MARKET PULSE'}
      </div>
      <div className="flex whitespace-nowrap animate-ticker items-center">
        {[...simulatedSales, ...simulatedSales].map((sale, i) => (
          <div key={i} className="flex items-center gap-2 px-8 border-r border-white/5">
            <span className="text-slate-400 text-[10px] font-bold">{sale.name}</span>
            <span className="text-white text-[10px] font-black">${sale.price}</span>
            <i className={`fas fa-caret-${sale.trend === 'up' ? 'up text-green-500' : sale.trend === 'down' ? 'down text-red-500' : 'right text-slate-500'} text-[10px]`}></i>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TickerTape;
