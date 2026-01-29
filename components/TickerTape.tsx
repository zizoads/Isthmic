
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
    <div className="fixed bottom-0 left-0 w-full bg-[#0a0a0c]/95 backdrop-blur-xl border-t border-white/5 h-12 flex items-center overflow-hidden z-[1000] select-none font-sans">
      <div className="bg-[#161618] px-10 h-full flex items-center text-[9px] font-black uppercase tracking-widest text-white z-20 shadow-[10px_0_30px_rgba(0,0,0,0.8)] border-r border-white/5 italic">
        {lang === 'ar' ? 'نبض الأصول' : 'ASSET PULSE'}
      </div>
      <div className="flex whitespace-nowrap animate-ticker items-center">
        {[...simulatedSales, ...simulatedSales].map((sale, i) => (
          <div key={i} className="flex items-center gap-4 px-12 border-r border-white/[0.03] group cursor-default">
            <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors italic">{sale.name}</span>
            <span className="text-white text-[12px] font-light data-mono tracking-tighter">${sale.price}</span>
            <span className={`text-[9px] font-black ${
              sale.trend === 'up' ? 'text-[#c5a059]' : sale.trend === 'down' ? 'text-red-500/60' : 'text-slate-600'
            }`}>
              {sale.trend === 'up' ? '▲' : sale.trend === 'down' ? '▼' : '●'}
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
          animation: ticker 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default TickerTape;
