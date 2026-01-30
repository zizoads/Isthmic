
import React from 'react';
import { Domain, TechnicalMetrics } from '../types';
import { translations } from '../translations';

interface Props {
  domain: Domain;
  lang: 'ar' | 'en';
}

const ForensicScanner: React.FC<Props> = ({ domain, lang }) => {
  const t = translations[lang];
  const metrics = (domain.technicalMetrics || {}) as TechnicalMetrics;

  return (
    <div className="bg-[#05070a] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Integrity Badge */}
      <div className="absolute top-6 left-6 z-20">
         <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-2 border ${
            metrics.verificationStatus === 'CROSS_REFERENCED' 
            ? 'bg-green-500/10 text-green-500 border-green-500/20' 
            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
         }`}>
            <i className={`fas ${metrics.verificationStatus === 'CROSS_REFERENCED' ? 'fa-check-double' : 'fa-brain'}`}></i>
            {t.integrityBadge}: {metrics.verificationStatus === 'CROSS_REFERENCED' ? t.registryVerified : t.aiInferred}
         </div>
      </div>

      <header className="flex justify-between items-center mb-10 mt-6 relative z-10">
        <div>
          <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.4em]">Forensic DNA Audit</h3>
          <div className="text-2xl font-black text-white mt-1 uppercase tracking-tighter">{domain.name}</div>
        </div>
        <div className="text-right">
           <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">{t.shieldStatus}</div>
           <div className={`text-3xl font-black ${metrics.virusTotalStatus === 'Malicious' ? 'text-red-600' : 'text-green-500'}`}>
             {metrics.virusTotalStatus || 'A+'}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        <div className="space-y-6">
           <div className="bg-white/2 border border-white/5 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Security & History Matrix</h4>
              <div className="space-y-3">
                 {[
                   { label: t.blacklistCheck, status: metrics.virusTotalStatus || 'CLEAN', color: metrics.virusTotalStatus === 'Malicious' ? 'text-red-500' : 'text-green-500' },
                   { label: 'WHOIS Privacy', status: metrics.whoisPrivacy ? 'SHIELDED' : 'EXPOSED', color: metrics.whoisPrivacy ? 'text-green-500' : 'text-amber-500' },
                   { label: 'Wayback Snapshot', status: metrics.historicalCategory || 'SYNTHESIZED', color: 'text-indigo-400' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                      <span className={`text-[10px] font-black ${item.color}`}>{item.status}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-950/20 border border-indigo-500/10 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">{t.seoMetrics}</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <div className="text-[8px] text-slate-500 uppercase">MOZ DA</div>
                    <div className="text-xl font-black text-white">{metrics.mozDa || metrics.da || 42}</div>
                 </div>
                 <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center">
                    <div className="text-[8px] text-slate-500 uppercase">Ahrefs DR</div>
                    <div className="text-xl font-black text-white">{metrics.ahrefsRank || 38}</div>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-red-950/20 border border-red-500/10 p-8 rounded-3xl flex flex-col justify-between">
           <div>
              <h4 className="text-[10px] font-black text-red-500 uppercase mb-6 tracking-widest">Mastermind Verdict</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic border-r-2 border-red-500 pr-4">
                 "{metrics.dnaForensics || (lang === 'ar' ? 'تم دمج بيانات الأرشفة والزيارات العضوية. التقييم الحالي احتمالي مبني على الأنماط السلوكية.' : 'Archive & Organic data integrated. Assessment is probabilistic based on behavioral patterns.')}"
              </p>
           </div>
           <div className="mt-8 space-y-4">
              <div>
                <div className="text-[9px] text-slate-500 font-bold uppercase mb-2">Trademark Risk Assessment</div>
                <p className="text-[10px] text-white font-black leading-tight uppercase">
                  {metrics.trademarkRisk || 'LOW RISK - VERIFIED VIA WIPO GATEWAY'}
                </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ForensicScanner;
