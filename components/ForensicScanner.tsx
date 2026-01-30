
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

  const getSeverityColor = (status: string | undefined) => {
    if (status === 'Malicious') return 'text-red-500 bg-red-500/10 border-red-500/20';
    if (status === 'Suspicious') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-green-500 bg-green-500/10 border-green-500/20';
  };

  return (
    <div className="glass-card rounded-[32px] p-8 lg:p-12 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Visual DNA Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-12 relative z-10">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Forensic DNA Signature</span>
          </div>
          <h3 className="text-4xl lg:text-5xl prestige-heading text-white italic lowercase">{domain.name}</h3>
        </div>

        <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border ${getSeverityColor(metrics.virusTotalStatus)}`}>
           <i className={`fas ${metrics.virusTotalStatus === 'Malicious' ? 'fa-biohazard' : 'fa-shield-check'} text-xl`}></i>
           <div className="text-right">
              <div className="text-[8px] font-black uppercase tracking-widest opacity-60">Security Protocol</div>
              <div className="text-sm font-black uppercase tracking-tighter">{metrics.virusTotalStatus || 'Clean Access'}</div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        {/* Core Authority Metrics */}
        <div className="space-y-6">
           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Authority Indices</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1">
                    <div className="text-[8px] text-slate-500 uppercase">Domain Auth</div>
                    <div className="text-2xl font-light prestige-heading text-white">{metrics.da || '--'}</div>
                 </div>
                 <div className="space-y-1">
                    <div className="text-[8px] text-slate-500 uppercase">Spam Ratio</div>
                    <div className={`text-2xl font-light prestige-heading ${metrics.spamScore && metrics.spamScore > 10 ? 'text-red-400' : 'text-green-400'}`}>
                       {metrics.spamScore || '0'}%
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Reputation Intelligence */}
        <div className="space-y-6">
           <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
              <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-6">Historical Reputation</h4>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-bold tracking-tighter">Wayback Pulse</span>
                    <span className="text-white font-mono">{metrics.historicalCategory || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-500 uppercase font-bold tracking-tighter">Ownership Cycles</span>
                    <span className="text-white font-mono">Verified Legacy</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Executive Summary */}
        <div className="p-8 rounded-2xl bg-accent/5 border border-accent/20 flex flex-col justify-between">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-accent uppercase tracking-widest">Mastermind Verdict</h4>
              <p className="text-base text-slate-300 leading-relaxed italic prestige-heading">
                 "{metrics.dnaForensics || (lang === 'ar' ? 'تم استنباط النزاهة التاريخية عبر معايرة الأرشفة والسمعة الرقمية. الأصل مؤهل للاستحواذ الاستراتيجي.' : 'Historical integrity inferred via archive calibration. Asset qualified for strategic acquisition.')}"
              </p>
           </div>
           
           <div className="mt-8 pt-6 border-t border-accent/10">
              <div className="flex justify-between items-center">
                 <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{t.integrityBadge}</div>
                 <div className="text-[10px] font-black text-accent uppercase">{metrics.verificationStatus === 'CROSS_REFERENCED' ? t.registryVerified : t.aiInferred}</div>
              </div>
           </div>
        </div>
      </div>

      <i className="fas fa-fingerprint absolute right-[-40px] bottom-[-40px] text-white/[0.02] text-[200px] pointer-events-none -rotate-12"></i>
    </div>
  );
};

export default ForensicScanner;
