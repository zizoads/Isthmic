
import React from 'react';
import { Domain } from '../types';

interface Props {
  domain: Domain;
  lang: 'ar' | 'en';
  marketHeat?: number; // Optional 0-100 score
}

const HardROICalculator: React.FC<Props> = ({ domain, lang, marketHeat = 50 }) => {
  const acq = domain.price || 0;
  
  // Calculate Market Multiplier based on Heat Score
  const heatMultiplier = 1 + (marketHeat / 200); // Heat of 100 adds 50% value boost
  
  const baseTarget = domain.financials?.targetExitPrice || acq * 10;
  const target = Math.round(baseTarget * heatMultiplier);
  
  const escrow = target * 0.0325; // Standard Escrow.com fees
  const platform = target * 0.15; // Standard Afternic/Sedo fees
  const renewal = 15; // Avg renewal
  const net = target - acq - escrow - platform - renewal;
  const roi = (net / acq) * 100;

  return (
    <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6 font-mono text-[11px] text-white relative overflow-hidden">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <h3 className="text-indigo-400 font-black uppercase tracking-widest">
          {lang === 'ar' ? 'الجدوى الاقتصادية الديناميكية' : 'DYNAMIC ECONOMIC REPORT'}
        </h3>
        <span className={`text-[8px] font-black px-2 py-0.5 rounded ${marketHeat > 70 ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-slate-400'}`}>
           HEAT: {marketHeat}%
        </span>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'تكلفة الاستحواذ' : 'ACQUISITION COST'}</span>
          <span className="font-bold text-slate-300">${acq.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'سعر البيع المعدل (زخم)' : 'ADJUSTED EXIT PRICE'}</span>
          <span className="font-bold text-green-400">${target.toLocaleString()}</span>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl relative z-10">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-indigo-300 font-black">{lang === 'ar' ? 'صافي الربح الديناميكي' : 'DYNAMIC NET PROFIT'}</span>
            <span className="text-xl font-black text-white">${Math.max(0, net).toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-indigo-300/60">{lang === 'ar' ? 'عائد الاستثمار المتوقع' : 'ESTIMATED ROI'}</span>
            <span className={`text-sm font-black ${roi > 500 ? 'text-green-500' : 'text-indigo-400'}`}>
              {roi.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[8px] text-slate-600 italic">
        <i className="fas fa-microchip"></i>
        <span>{lang === 'ar' ? 'تم ضبط السعر بناءً على إشارات السوق اللحظية.' : 'Price calibrated via real-time market signals.'}</span>
      </div>
      <i className="fas fa-percentage absolute right-[-10px] bottom-[-10px] text-white/2 text-6xl pointer-events-none"></i>
    </div>
  );
};

export default HardROICalculator;
