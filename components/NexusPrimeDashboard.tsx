
import React, { useState } from 'react';
import { NexusOpportunity } from '../types';
import { nexusPrimeIntelligenceAI } from '../services/geminiService';

interface Props {
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const NexusPrimeDashboard: React.FC<Props> = ({ addLog }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<NexusOpportunity[]>([]);
  const [activeMode, setActiveMode] = useState<'Arbitrage' | 'Temporal' | 'Forensic'>('Arbitrage');

  const handleActivateNexus = async () => {
    setIsThinking(true);
    addLog('Nexus Prime', 'Activating Autonomous Strategic Partner. Bypassing API constraints...', 'info');
    
    const context = activeMode === 'Arbitrage' 
      ? 'Scan marketplaces (Sedo/Afternic) via search grounding for pricing discrepancies in AI and Biotech domains.'
      : activeMode === 'Temporal'
      ? 'Predict emerging tech keywords for Q4 2025 and 2026 based on patent filings and search density patterns.'
      : 'Analyze historical authority of expired assets without using Moz/Ahrefs APIs.';

    const result = await nexusPrimeIntelligenceAI(activeMode, context);
    
    if (result) {
      setVerdict(result.analysisVerdict);
      setOpportunities(result.opportunities);
      addLog('Nexus Prime', 'Strategic sweep complete. Deep deductions mapped.', 'success');
    } else {
      addLog('Nexus Prime', 'Nexus logic encountered an obstruction.', 'critical');
    }
    setIsThinking(false);
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#0a0c10] to-[#1a1f2e] p-16 rounded-[60px] text-white shadow-2xl relative overflow-hidden border border-indigo-500/20">
        <div className="relative z-10 max-w-4xl">
           <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-3xl shadow-2xl shadow-indigo-500/30 animate-pulse">
                 <i className="fas fa-microchip"></i>
              </div>
              <div>
                 <h2 className="text-5xl font-black tracking-tighter uppercase leading-none">NEXUS PRIME</h2>
                 <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.5em] mt-3">Autonomous Strategic Partner</p>
              </div>
           </div>
           <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-medium mb-12 italic border-r-4 border-indigo-500 pr-8">
             "هنا يتجاوز المستشار حدود البرمجيات التقليدية. نستخدم خوارزميات الاستدلال المعمق لتعويض نقص الـ APIs واستخراج فرص استثمارية من 'باطن البيانات' عبر الويب المفتوح."
           </p>

           <div className="flex flex-wrap gap-4">
              {(['Arbitrage', 'Temporal', 'Forensic'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeMode === mode ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {mode === 'Arbitrage' ? 'قنص الفوارق (Arbitrage)' : mode === 'Temporal' ? 'توقع الموجات (Temporal)' : 'التدقيق الاستنباطي (Forensic)'}
                </button>
              ))}
           </div>

           <div className="mt-12">
              <button 
                onClick={handleActivateNexus}
                disabled={isThinking}
                className="bg-white text-slate-900 px-16 py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 flex items-center gap-4"
              >
                {isThinking ? <i className="fas fa-brain fa-spin"></i> : <i className="fas fa-bolt"></i>}
                {isThinking ? 'جاري تشغيل محرك الاستدلال...' : 'تفعيل الشريك الاستراتيجي'}
              </button>
           </div>
        </div>
        <div className="absolute left-[-100px] bottom-[-100px] text-indigo-500/5 text-[500px] pointer-events-none">
           <i className="fas fa-atom"></i>
        </div>
      </div>

      {isThinking && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
           {[1,2,3].map(i => <div key={i} className="h-64 bg-white/5 border border-white/10 rounded-[40px]"></div>)}
        </div>
      )}

      {verdict && (
        <div className="bg-white p-12 rounded-[50px] border shadow-sm animate-slide-up border-slate-100">
          <div className="flex justify-between items-start mb-12">
             <div className="text-right max-w-2xl">
                <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">القرار الاستراتيجي (Verdict)</h3>
                <p className="text-xl font-bold text-slate-800 leading-relaxed italic border-r-4 border-indigo-100 pr-6">"{verdict}"</p>
             </div>
             <div className="bg-indigo-50 px-6 py-4 rounded-3xl border border-indigo-100 text-center">
                <div className="text-[9px] font-black text-indigo-400 uppercase">قوة الإشارة</div>
                <div className="text-3xl font-black text-indigo-600">98.4%</div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-8 bg-slate-900 rounded-[40px] text-white border border-white/5 hover:border-indigo-500 transition-all group relative overflow-hidden">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                     <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest">{opp.type}</span>
                     <div className="text-right">
                        <h4 className="font-black text-lg text-white group-hover:text-indigo-400 transition-colors">{opp.title}</h4>
                        <div className="text-2xl font-black text-indigo-400 mt-2">{opp.estimatedValue}</div>
                     </div>
                  </div>
                  
                  <p className="text-xs text-slate-400 leading-relaxed mb-6 font-medium line-clamp-3">"{opp.description}"</p>
                  
                  <div className="mt-auto pt-6 border-t border-white/10">
                     <div className="text-[8px] font-black text-indigo-500 uppercase mb-2">كيف تم الاستنباط؟</div>
                     <p className="text-[10px] text-slate-500 italic leading-relaxed mb-6">{opp.aiDeduction}</p>
                     
                     <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                        {opp.suggestedAction}
                     </button>
                  </div>
                </div>
                <i className={`fas ${opp.type === 'Arbitrage' ? 'fa-scale-balanced' : opp.type === 'Temporal' ? 'fa-hourglass' : 'fa-dna'} absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px]`}></i>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NexusPrimeDashboard;
