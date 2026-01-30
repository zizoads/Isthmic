
import React from 'react';
import { useDomainContext } from '../context/DomainContext';
import { PlanDetails } from '../types';

interface Props {
  onClose: () => void;
  lang: 'ar' | 'en';
}

const PricingTerminal: React.FC<Props> = ({ onClose, lang }) => {
  const { monetization, activeProfile } = useDomainContext();

  const handleUpgrade = (tier: string) => {
    // stripe integration hook
    console.log(`Upgrading to ${tier}`);
    alert(lang === 'ar' ? 'جاري تحويلك لبوابة الدفع الآمنة...' : 'Redirecting to secure payment gateway...');
  };

  const planEntries = Object.entries(monetization.plans) as [string, PlanDetails][];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 transition-all duration-700">
      <div className="absolute inset-0 bg-[#0a0a0c]/90 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-6xl bg-[#111113] border border-white/10 rounded-[48px] p-10 lg:p-14 shadow-2xl overflow-hidden animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic">Upgrade Sovereignty</h2>
           <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em]">Choose your tactical access level</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {planEntries.map(([tier, details]) => {
            const isCurrent = activeProfile?.subscriptionTier === tier;
            return (
              <div key={tier} className={`square-card p-10 flex flex-col justify-between transition-all duration-500 border group ${isCurrent ? 'border-[#c5a059] bg-[#c5a059]/5' : 'hover:border-white/20 bg-white/[0.02]'}`}>
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-black text-white italic tracking-tighter uppercase">{tier}</h3>
                    {isCurrent && <span className="px-3 py-1 bg-[#c5a059] text-black text-[8px] font-black rounded-full uppercase">Active</span>}
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-light prestige-heading text-white">${details.price}</span>
                    <span className="text-[10px] font-black text-slate-500 uppercase">/ Month</span>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                     <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                        <i className="fas fa-microchip text-[#c5a059]"></i> {details.maxScans} AI Scans / mo
                     </div>
                     <div className="flex items-center gap-3 text-[10px] font-bold text-slate-300">
                        <i className="fas fa-shield-check text-[#c5a059]"></i> {details.maxAudits} Forensic Audits / mo
                     </div>
                     {details.features.map((f, i) => (
                       <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                          <i className="fas fa-check text-green-500"></i> {f}
                       </div>
                     ))}
                  </div>
                </div>

                <button 
                  onClick={() => !isCurrent && handleUpgrade(tier)}
                  disabled={isCurrent}
                  className={`mt-10 w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${isCurrent ? 'bg-white/5 text-slate-600' : 'bg-white text-black hover:bg-[#c5a059] hover:text-white shadow-xl'}
                  `}
                >
                  {isCurrent ? 'CURRENT ACCESS' : 'ENGAGE PLAN'}
                </button>
              </div>
            );
          })}
        </div>

        <button onClick={onClose} className="absolute top-10 right-10 text-slate-500 hover:text-white transition-colors">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default PricingTerminal;
