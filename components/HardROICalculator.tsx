
import React from 'react';
import { Domain } from '../types';

interface Props {
  domain: Domain;
  lang: 'ar' | 'en';
}

const HardROICalculator: React.FC<Props> = ({ domain, lang }) => {
  const acq = domain.price || 0;
  const target = domain.financials?.targetExitPrice || acq * 10;
  const escrow = target * 0.0325; // Standard Escrow.com fees
  const platform = target * 0.15; // Standard Afternic/Sedo fees
  const renewal = 15; // Avg renewal
  const net = target - acq - escrow - platform - renewal;
  const roi = (net / acq) * 100;

  return (
    <div className="bg-[#0b0e14] border border-white/10 rounded-2xl p-6 font-mono text-[11px] text-white">
      <h3 className="text-indigo-400 font-black uppercase mb-4 tracking-widest border-b border-white/5 pb-2">
        {lang === 'ar' ? 'تقرير الجدوى الاقتصادية' : 'ECONOMIC FEASIBILITY REPORT'}
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'تكلفة الاستحواذ' : 'ACQUISITION COST'}</span>
          <span className="font-bold text-red-400">${acq.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'سعر البيع المستهدف' : 'TARGET EXIT PRICE'}</span>
          <span className="font-bold text-green-400">${target.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1 opacity-50">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'عمولات المنصات (15%)' : 'PLATFORM FEES (15%)'}</span>
          <span className="font-bold">-${platform.toFixed(0)}</span>
        </div>
        <div className="flex justify-between border-b border-white/5 pb-1 opacity-50">
          <span className="text-slate-500 uppercase">{lang === 'ar' ? 'رسوم الضمان (Escrow)' : 'ESCROW FEES'}</span>
          <span className="font-bold">-${escrow.toFixed(0)}</span>
        </div>
        
        <div className="mt-6 p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-indigo-300 font-black">{lang === 'ar' ? 'الربح الصافي المتوقع' : 'ESTIMATED NET PROFIT'}</span>
            <span className="text-xl font-black text-white">${net.toFixed(0)}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-indigo-300/60">{lang === 'ar' ? 'عائد الاستثمار الفعلي' : 'ACTUAL ROI'}</span>
            <span className={`text-sm font-black ${roi > 300 ? 'text-green-500' : 'text-amber-500'}`}>
              {roi.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-[9px] text-slate-500 italic">
        <i className="fas fa-info-circle"></i>
        <span>{lang === 'ar' ? 'هذه الحسابات تخصم جميع التكاليف الجانبية.' : 'Calculations include all operational overhead.'}</span>
      </div>
    </div>
  );
};

export default HardROICalculator;
