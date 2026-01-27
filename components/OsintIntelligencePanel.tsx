
import React, { useState } from 'react';
import { performOsintInvestigationAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  lang: 'ar' | 'en';
}

const OsintIntelligencePanel: React.FC<Props> = ({ lang }) => {
  const [target, setTarget] = useState('');
  const [investigating, setInvestigating] = useState(false);
  const [data, setData] = useState<any>(null);

  const handleInvestigate = async () => {
    if (!target) return;
    setInvestigating(true);
    const result = await performOsintInvestigationAI(target, lang);
    setData(result);
    setInvestigating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#05070a] border border-white/10 rounded-[32px] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">
            {lang === 'ar' ? 'مركز الاستخبارات الرقمية (OSINT)' : 'OSINT INTELLIGENCE CENTER'}
          </h3>
          <div className="flex gap-4">
            <input 
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500/50"
              placeholder={lang === 'ar' ? 'أدخل نطاق، إيميل، أو اسم شركة...' : 'Enter domain, email, or company name...'}
            />
            <button 
              onClick={handleInvestigate}
              disabled={investigating}
              className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-indigo-900/20"
            >
              {investigating ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-user-secret"></i>}
            </button>
          </div>
        </div>
        <i className="fas fa-fingerprint absolute right-[-40px] bottom-[-40px] text-white/2 text-[250px] pointer-events-none -rotate-12"></i>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up">
           {/* Security Posture */}
           <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-[40px] border dark:border-white/5 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang === 'ar' ? 'الوضعية الأمنية' : 'SECURITY POSTURE'}</h4>
                 <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${
                    data.threatLevel === 'Malicious' ? 'bg-red-500 text-white' : 
                    data.threatLevel === 'Suspicious' ? 'bg-amber-500 text-white' : 'bg-green-500 text-white'
                 }`}>{data.threatLevel}</span>
              </div>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-500">{lang === 'ar' ? 'تسريب بيانات' : 'DATA BREACH'}</span>
                    <span className={`text-xs font-black ${data.dataBreachAlert ? 'text-red-500' : 'text-green-500'}`}>
                       {data.dataBreachAlert ? (lang === 'ar' ? 'مكتشف!' : 'DETECTED!') : (lang === 'ar' ? 'نظيف' : 'CLEAN')}
                    </span>
                 </div>
                 <div className="p-5 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-3">{lang === 'ar' ? 'سجل الـ DNS المستخلص' : 'EXTRACTED DNS LOG'}</div>
                    <div className="space-y-2">
                       {data.dnsSummary?.map((log: string, i: number) => (
                          <div key={i} className="text-[10px] font-mono text-indigo-400 leading-tight">>> {log}</div>
                       ))}
                    </div>
                 </div>
              </div>
           </div>

           {/* Forensic Analysis */}
           <div className="lg:col-span-2 bg-[#0b0e14] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-white/5">
              <div className="relative z-10 flex-1">
                 <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6">{lang === 'ar' ? 'الاستنباط الجنائي' : 'FORENSIC DEDUCTION'}</h4>
                 <p className="text-2xl font-black leading-tight mb-10 italic">
                    "{data.forensicVerdict}"
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                       <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">{lang === 'ar' ? 'الكيانات المرتبطة' : 'ASSOCIATED ENTITIES'}</h5>
                       <div className="flex flex-wrap gap-2">
                          {data.associatedEntities?.map((entity: string, i: number) => (
                             <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-indigo-300">
                                <i className="fas fa-link mr-2 text-[8px]"></i> {entity}
                             </span>
                          ))}
                       </div>
                    </div>
                    <div className="flex flex-col justify-end">
                       <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all">
                          {lang === 'ar' ? 'تصدير التقرير الاستخباراتي' : 'EXPORT INTEL REPORT'}
                       </button>
                    </div>
                 </div>
              </div>
              <i className="fas fa-shield-halved absolute left-[-40px] top-[-40px] text-white/5 text-[180px]"></i>
           </div>
        </div>
      )}
    </div>
  );
};

export default OsintIntelligencePanel;
