
import React, { useState } from 'react';
import { ArabicAnalysisService } from '../services/ai/ArabicAnalysisService';
import PrestigeLoader from './ui/PrestigeLoader';

const ArabicLabTester: React.FC = () => {
  const [input, setInput] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTest = async () => {
    if (!input) return;
    setIsLoading(true);
    const res = await ArabicAnalysisService.analyzeMessage(input);
    setAnalysis(res);
    setIsLoading(false);
  };

  const examples = [
    "بكم تبيع النطاق؟ أنا مهتم جداً للشراء الفوري",
    "السعر غالي جداً، أعرض عليك 500 دولار فقط",
    "هل النطاق متاح للاستخدام التجاري في السعودية؟"
  ];

  return (
    <div className="space-y-12 animate-precision max-w-5xl mx-auto pb-20" dir="rtl">
      <header className="space-y-4">
        <div className="flex items-center gap-4">
           <div className="w-2 h-8 bg-[#c5a059]"></div>
           <h1 className="text-4xl lg:text-7xl prestige-heading text-white italic leading-none">مختبر الصقور العربي</h1>
        </div>
        <p className="text-slate-500 text-sm font-black uppercase tracking-[0.4em]">Falcon-Arabic 7B // Linguistic Forensics</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="square-card p-10 space-y-8">
            <h3 className="text-xl font-bold text-white italic underline decoration-[#c5a059]">حقن النص التفاوضي</h3>
            <textarea 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-black/40 border border-white/10 p-6 rounded-3xl text-white text-lg min-h-[200px] outline-none focus:border-[#c5a059] transition-all"
              placeholder="انسخ رسالة المشتري العربية هنا..."
            />
            <div className="flex flex-wrap gap-3">
              {examples.map((ex, i) => (
                <button key={i} onClick={() => setInput(ex)} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] text-slate-400 hover:text-white transition-all italic">
                  مثال {i + 1}
                </button>
              ))}
            </div>
            <button 
              onClick={handleTest}
              disabled={isLoading || !input}
              className="w-full prestige-btn prestige-btn-gold !py-6"
            >
              {isLoading ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-falcon"></i>}
              <span className="mr-3">تشغيل تحليل Falcon-Arabic</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
           <div className="bg-[#050505] border border-white/5 rounded-[50px] p-10 min-h-[500px] relative overflow-hidden flex flex-col">
              <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.3em] mb-10">الاستنباط اللغوي</h3>
              
              {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                   <PrestigeLoader label="جاري معايرة الصقر..." />
                </div>
              ) : analysis ? (
                <div className="space-y-8 animate-slide-up relative z-10">
                   <div className="space-y-2">
                      <div className="text-[9px] font-black text-slate-500 uppercase">النية المكتشفة</div>
                      <p className="text-xl text-white font-bold italic">"{analysis.intent}"</p>
                   </div>
                   <div className="space-y-2">
                      <div className="text-[9px] font-black text-slate-500 uppercase">العاطفة السائدة</div>
                      <span className="px-4 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-black">
                         {analysis.sentiment}
                      </span>
                   </div>
                   <div className="p-6 bg-[#c5a059]/5 border border-[#c5a059]/20 rounded-3xl">
                      <div className="text-[9px] font-black text-[#c5a059] uppercase mb-4">التحليل الثقافي</div>
                      <p className="text-sm text-slate-300 leading-relaxed italic">{analysis.culturalNuance}</p>
                   </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-10">
                   <i className="fas fa-feather-pointed text-8xl mb-6"></i>
                   <p className="text-xs font-black uppercase tracking-[0.4em]">بانتظار إشارة دخل</p>
                </div>
              )}
              <i className="fas fa-signature absolute left-[-40px] bottom-[-40px] text-white/[0.01] text-[250px] pointer-events-none rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ArabicLabTester;
