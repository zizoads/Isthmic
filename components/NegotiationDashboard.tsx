
import React, { useState } from 'react';
import { Domain } from '../types';
import { analyzeNegotiationTacticsAI, generateClosingTermSheetAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [negotiations, setNegotiations] = useState([
    {
      id: '1',
      domain: 'quantum-agents.com',
      lastReply: 'نحن نبحث عن اسم لشركتنا الناشئة. مبلغ 15 ألف دولار مرتفع جداً. عرضنا النهائي هو 4 آلاف دولار للدفع اليوم.',
      buyerName: 'Stealth Ventures',
      currentAsk: 15000,
      analysis: null as any,
      termSheet: null as string | null
    }
  ]);

  const [analyzingId, setAnalyzingId] = useState<string | null>(null);

  const handleDeepAnalysis = async (negId: string) => {
    const neg = negotiations.find(n => n.id === negId);
    if (!neg) return;
    setAnalyzingId(negId);
    
    const result = await analyzeNegotiationTacticsAI(neg.lastReply, neg.domain, neg.currentAsk);
    
    setNegotiations(prev => prev.map(n => n.id === negId ? { ...n, analysis: result } : n));
    setAnalyzingId(null);
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {negotiations.map(neg => (
          <div key={neg.id} className="bg-white rounded-[50px] border shadow-sm overflow-hidden flex flex-col hover:shadow-2xl transition-all border-slate-100 text-right group">
            <div className="p-12 border-b flex justify-between items-center bg-slate-50/30">
              <div className="text-right">
                <h4 className="font-black text-slate-900 text-3xl tracking-tighter uppercase">{neg.domain}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                   <i className="fas fa-user-circle text-indigo-500"></i> {neg.buyerName} • تواصل مباشر
                </p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase">المبلغ المطلوب</span>
                <span className="text-2xl font-black text-indigo-600">${neg.currentAsk.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-12 space-y-12">
              <div className="bg-slate-900 text-white rounded-[32px] p-8 relative overflow-hidden group-hover:bg-slate-800 transition-colors">
                <div className="text-[10px] text-indigo-400 font-black uppercase mb-4 tracking-widest flex items-center justify-end gap-2">
                  نص العرض الأخير <i className="fas fa-quote-right text-[8px]"></i>
                </div>
                <p className="text-sm italic text-slate-300 leading-relaxed font-medium">"{neg.lastReply}"</p>
                <div className="mt-8 flex justify-end">
                   <button 
                    onClick={() => handleDeepAnalysis(neg.id)}
                    disabled={analyzingId === neg.id}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-xl"
                  >
                    {analyzingId === neg.id ? <i className="fas fa-brain fa-spin"></i> : 'تحليل "بطاقة المعركة"'}
                  </button>
                </div>
              </div>

              {neg.analysis && (
                <div className="space-y-10 animate-slide-up">
                  {/* Buyer Battle Card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                       <div className="text-[8px] font-black text-indigo-400 uppercase mb-2">الدوافع الخفية</div>
                       <div className="text-[11px] font-bold text-slate-700 leading-relaxed">{neg.analysis.hiddenMotives}</div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border">
                       <div className="text-[8px] font-black text-slate-400 uppercase mb-2">نمط المشتري</div>
                       <div className="text-[11px] font-bold text-slate-700 leading-relaxed">{neg.analysis.buyerType}</div>
                    </div>
                    <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
                       <div className="text-[8px] font-black text-green-500 uppercase mb-2">ثقة الإغلاق</div>
                       <div className="text-xl font-black text-green-700">{neg.analysis.sentimentScore}/10</div>
                    </div>
                  </div>

                  <div className="bg-indigo-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                       <div className="flex justify-between items-center mb-8">
                          <span className="text-3xl font-black">${neg.analysis.suggestedCounter.toLocaleString()}</span>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-indigo-200">العرض المضاد المقترح</h5>
                       </div>
                       <div className="bg-white/10 p-6 rounded-2xl border border-white/10 text-xs font-medium italic leading-relaxed mb-8">
                         "{neg.analysis.tacticalResponse}"
                       </div>
                       <div className="flex gap-4">
                          <button onClick={() => window.open('https://www.escrow.com', '_blank')} className="flex-1 py-5 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all">
                             إنشاء معاملة Escrow
                          </button>
                          <button className="flex-1 py-5 bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-400">
                             نسخ نص الرد
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NegotiationDashboard;
