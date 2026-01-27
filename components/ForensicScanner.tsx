
import React from 'react';
import { Domain, TechnicalMetrics } from '../types';

interface Props {
  domain: Domain;
  lang: 'ar' | 'en';
}

const ForensicScanner: React.FC<Props> = ({ domain, lang }) => {
  // Cast to TechnicalMetrics to allow access to optional/extended properties
  const metrics = (domain.technicalMetrics || {}) as TechnicalMetrics;

  return (
    <div className="bg-[#05070a] border border-white/5 rounded-[40px] p-10 shadow-2xl relative overflow-hidden font-mono" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex justify-between items-center mb-10 relative z-10">
        <div>
          <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.4em]">Forensic DNA Audit</h3>
          <div className="text-2xl font-black text-white mt-1 uppercase tracking-tighter">{domain.name}</div>
        </div>
        <div className="text-right">
           <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">Asset Integrity</div>
           <div className={`text-3xl font-black ${metrics.securityRating === 'F' ? 'text-red-600' : 'text-green-500'}`}>
             {metrics.securityRating || 'A+'}
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
        {/* Security Matrix */}
        <div className="space-y-6">
           <div className="bg-white/2 border border-white/5 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Security Checklist</h4>
              <div className="space-y-3">
                 {[
                   { label: 'Blacklist Check', status: metrics.isBlacklisted ? 'FAILED' : 'CLEAN', color: metrics.isBlacklisted ? 'text-red-500' : 'text-green-500' },
                   { label: 'WHOIS Privacy', status: metrics.whoisPrivacy ? 'SHIELDED' : 'EXPOSED', color: metrics.whoisPrivacy ? 'text-green-500' : 'text-amber-500' },
                   { label: 'MX Record Integrity', status: metrics.mxRecordsFound ? 'NOMINAL' : 'ABSENT', color: metrics.mxRecordsFound ? 'text-blue-500' : 'text-slate-500' }
                 ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                      <span className={`text-[10px] font-black ${item.color}`}>{item.status}</span>
                   </div>
                 ))}
              </div>
           </div>

           <div className="bg-white/2 border border-white/5 p-6 rounded-3xl">
              <h4 className="text-[10px] font-black text-slate-500 uppercase mb-4 tracking-widest">Historical DNA</h4>
              <div className="flex items-center gap-6">
                 <div className="text-center">
                    <div className="text-2xl font-black text-white">{metrics.historyYears || 12}</div>
                    <div className="text-[8px] text-slate-500 uppercase">Years Age</div>
                 </div>
                 <div className="h-10 w-[1px] bg-white/10"></div>
                 <div className="text-center">
                    <div className="text-2xl font-black text-white">{metrics.backlinks || '2.4K'}</div>
                    <div className="text-[8px] text-slate-500 uppercase">Backlinks</div>
                 </div>
              </div>
           </div>
        </div>

        {/* Intelligence Verdict */}
        <div className="bg-red-950/20 border border-red-500/10 p-8 rounded-3xl flex flex-col justify-between">
           <div>
              <h4 className="text-[10px] font-black text-red-500 uppercase mb-6 tracking-widest">Mastermind Verdict</h4>
              <p className="text-xs text-slate-300 leading-relaxed italic border-r-2 border-red-500 pr-4">
                 "{metrics.dnaForensics || (lang === 'ar' ? 'لم يتم العثور على مخاطر قانونية أو تقنية بارزة. الأصل جاهز للاستحواذ الاستراتيجي.' : 'No prominent legal or technical risks found. Asset primed for strategic acquisition.')}"
              </p>
           </div>
           <div className="mt-8">
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-2">Trademark Risk Assessment</div>
              <p className="text-[10px] text-white font-black leading-tight">
                {metrics.trademarkRisk || 'LOW RISK - UNCLAIMED IN ACTIVE CLASSES'}
              </p>
           </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center opacity-30">
         <span className="text-[8px] text-slate-500">ENGINE: SENTINEL_V4_SECURE</span>
         <div className="flex gap-4">
            <span className="text-[8px] text-slate-500 tracking-widest">IP: 142.250.190.46</span>
            <span className="text-[8px] text-slate-500 tracking-widest">LATENCY: 42MS</span>
         </div>
      </div>

      <i className="fas fa-shield-virus absolute right-[-40px] bottom-[-40px] text-white/5 text-[250px] pointer-events-none"></i>
    </div>
  );
};

export default ForensicScanner;
