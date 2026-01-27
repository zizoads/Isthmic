
import React from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  lang: 'ar' | 'en';
}

const PrecisionLiquidationMatrix: React.FC<Props> = ({ domains, lang }) => {
  const liquidationReady = domains.filter(d => d.status === 'purchased' || d.status === 'negotiating');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {liquidationReady.map((d, i) => (
          <div key={i} className="bg-[#05070a] border border-white/10 p-5 rounded-2xl hover:border-indigo-500 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="text-white text-sm font-black truncate max-w-[120px]">{d.name}</div>
              <div className="text-[10px] font-black text-indigo-400">${d.financials?.targetExitPrice?.toLocaleString() || 'TBD'}</div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full" style={{ width: `${d.financials?.liquidityScore || 0}%` }}></div>
              </div>
              <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
                <span>{lang === 'ar' ? 'درجة السيولة' : 'LIQUIDITY'}</span>
                <span>{d.financials?.liquidityScore || 0}%</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button className="py-2 bg-white/5 text-white text-[9px] font-black uppercase rounded-lg hover:bg-white/10">
                {lang === 'ar' ? 'تحليل المشتري' : 'BUYER INTEL'}
              </button>
              <button className="py-2 bg-indigo-600 text-white text-[9px] font-black uppercase rounded-lg hover:bg-indigo-500">
                {lang === 'ar' ? 'إغلاق سريع' : 'QUICK CLOSE'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0b0e14] border border-white/5 rounded-[32px] p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
            {lang === 'ar' ? 'مخطط كفاءة التسييل' : 'LIQUIDATION EFFICIENCY CHART'}
          </h3>
          <div className="text-xl font-black text-green-500">84.2% {lang === 'ar' ? 'معدل النجاح' : 'SUCC. RATE'}</div>
        </div>
        <div className="h-48 flex items-end gap-2 px-2">
           {[40, 65, 30, 85, 95, 50, 75, 45, 90, 60, 35, 80].map((h, i) => (
             <div key={i} className="flex-1 bg-indigo-500/20 rounded-t-lg group relative cursor-pointer hover:bg-indigo-500 transition-all" style={{ height: `${h}%` }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {h}%
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default PrecisionLiquidationMatrix;
