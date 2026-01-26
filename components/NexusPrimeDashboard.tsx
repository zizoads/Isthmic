
import React, { useState } from 'react';
import { NexusOpportunity, Domain } from '../types';
import { nexusPrimeIntelligenceAI } from '../services/geminiService';

interface Props {
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const NexusPrimeDashboard: React.FC<Props> = ({ addLog, setDomains }) => {
  const [isThinking, setIsThinking] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<NexusOpportunity[]>([]);
  const [activeMode, setActiveMode] = useState<'Arbitrage' | 'Temporal' | 'Forensic' | 'DNA_Audit'>('Temporal');

  const handleActivateNexus = async () => {
    setIsThinking(true);
    addLog('Nexus Prime', `Initializing Protocol: ${activeMode}. Syncing with global search nodes...`, 'info');
    
    const context = activeMode === 'Temporal'
      ? 'Scan global R&D papers, patent applications, and GitHub trending repositories to forecast the next "Quantum" or "AI" keyword surge.'
      : activeMode === 'DNA_Audit'
      ? 'Perform a deep digital archaeology on suspected high-value expired assets to find hidden SEO juice and trust signals.'
      : activeMode === 'Arbitrage'
      ? 'Detect price-lag between major registrars and secondary markets using grounded marketplace data.'
      : 'Analyze forensic risk markers for UDRP and trademark collisions in high-stakes sectors.';

    const result = await nexusPrimeIntelligenceAI(activeMode, context);
    
    if (result) {
      setVerdict(result.analysisVerdict);
      setRiskAssessment(result.strategicRiskAssessment);
      setOpportunities(result.opportunities);
      addLog('Nexus Prime', 'Strategic synthesis complete. Opportunities mapped to temporal signals.', 'success');
    } else {
      addLog('Nexus Prime', 'Neural link obstructed. Retrying via alternative grounding path...', 'critical');
    }
    setIsThinking(false);
  };

  const handleInject = (opp: NexusOpportunity) => {
    const newDomain: Domain = {
      id: Math.random().toString(),
      name: opp.title,
      price: parseInt(opp.estimatedValue.replace(/[^0-9]/g, '')) || 500,
      status: 'available',
      contentStatus: 'none',
      lastChecked: new Date().toISOString(),
      sector: opp.type,
      justification: opp.aiDeduction,
      probability: opp.probability / 100,
      technicalMetrics: {
        liquidityScore: opp.marketGapScore,
        dnaForensics: opp.aiDeduction
      }
    };
    setDomains(prev => [newDomain, ...prev]);
    addLog('System', `Opportunity "${opp.title}" injected into Pipeline.`, 'success');
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      {/* Nexus Core Hub */}
      <div className="bg-gradient-to-br from-[#05070a] via-[#0d1117] to-[#161b22] p-16 rounded-[60px] text-white shadow-2xl relative overflow-hidden border border-indigo-500/30">
        <div className="relative z-10 max-w-5xl">
           <div className="flex items-center gap-8 mb-10">
              <div className="w-24 h-24 bg-indigo-600 rounded-[35px] flex items-center justify-center text-4xl shadow-[0_0_50px_rgba(79,70,229,0.4)] animate-pulse border border-indigo-400/50">
                 <i className="fas fa-atom"></i>
              </div>
              <div>
                 <h2 className="text-6xl font-black tracking-tighter uppercase leading-none italic">NEXUS PRIME <span className="text-indigo-500 font-light">v2.5</span></h2>
                 <p className="text-indigo-400 text-sm font-black uppercase tracking-[0.6em] mt-4">Autonomous Industrial Intelligence</p>
              </div>
           </div>
           
           <p className="text-slate-300 text-xl leading-relaxed max-w-3xl font-medium mb-12 italic border-r-4 border-indigo-500 pr-10 bg-white/5 py-8 rounded-l-3xl">
             "مرحباً بك في المستوى السيادي من الاستثمار. هنا لا نحلل البيانات فقط، بل نستبق الزمن عبر استقراء الإشارات الضعيفة من مراكز الأبحاث ومستودعات الأكواد العالمية لبناء ثروتك الرقمية."
           </p>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {(['Temporal', 'DNA_Audit', 'Arbitrage', 'Forensic'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-6 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                    activeMode === mode 
                    ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 border-indigo-400' 
                    : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {mode === 'Temporal' ? 'استباق الموجات (Temporal)' : 
                   mode === 'DNA_Audit' ? 'الأركيولوجيا الرقمية (DNA)' : 
                   mode === 'Arbitrage' ? 'قنص الفوارق (Arbitrage)' : 'التحليل الجنائي (Forensic)'}
                </button>
              ))}
           </div>

           <div className="flex gap-6">
              <button 
                onClick={handleActivateNexus}
                disabled={isThinking}
                className="bg-white text-slate-900 px-20 py-7 rounded-[35px] font-black text-sm uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl shadow-indigo-500/20 flex items-center gap-4 group"
              >
                {isThinking ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-bolt group-hover:animate-bounce"></i>}
                {isThinking ? 'جاري اختراق الفجوة الزمنية...' : 'بدء الاستنباط الاستراتيجي'}
              </button>
           </div>
        </div>
        <div className="absolute right-[-100px] top-[-100px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]"></div>
      </div>

      {isThinking && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[1,2,3].map(i => (
             <div key={i} className="h-80 bg-[#0d1117] border border-white/5 rounded-[50px] relative overflow-hidden flex flex-col items-center justify-center gap-6">
                <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Scanning Global Neural Nodes...</div>
             </div>
           ))}
        </div>
      )}

      {verdict && (
        <div className="space-y-10 animate-slide-up">
          <div className="bg-white p-14 rounded-[60px] border shadow-2xl border-slate-100 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 relative z-10">
               <div className="flex-1 text-right">
                  <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-widest mb-6 flex items-center gap-3 justify-end">
                     مذكرة التقييم الاستراتيجي <i className="fas fa-file-signature"></i>
                  </h3>
                  <p className="text-3xl font-black text-slate-900 leading-tight mb-8">"{verdict}"</p>
                  <div className="p-8 bg-slate-50 rounded-[40px] border border-slate-100 italic text-slate-600 text-lg leading-relaxed font-medium">
                     تقييم المخاطر: {riskAssessment}
                  </div>
               </div>
               <div className="bg-indigo-900 p-10 rounded-[50px] text-white text-center min-w-[280px]">
                  <div className="text-[10px] font-black text-indigo-400 uppercase mb-4">موثوقية الاستنباط</div>
                  <div className="text-6xl font-black tracking-tighter">99.2<span className="text-indigo-400 text-3xl">%</span></div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-10 bg-slate-900 rounded-[50px] text-white border border-white/5 hover:border-indigo-500 transition-all group relative overflow-hidden flex flex-col h-full shadow-xl">
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8 text-right">
                     <div className="flex flex-col gap-2">
                        <span className="bg-indigo-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest self-end">{opp.type}</span>
                        {opp.temporalSignal && (
                          <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-lg self-end ${
                            opp.temporalSignal === 'Explosive' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                          }`}>إشارة زمنية: {opp.temporalSignal}</span>
                        )}
                     </div>
                     <div>
                        <h4 className="font-black text-2xl text-white group-hover:text-indigo-400 transition-colors leading-tight">{opp.title}</h4>
                        <div className="text-3xl font-black text-indigo-400 mt-3 tracking-tighter">{opp.estimatedValue}</div>
                     </div>
                  </div>
                  
                  <p className="text-sm text-slate-400 leading-relaxed mb-8 font-medium italic border-r-2 border-white/10 pr-6 text-right">"{opp.description}"</p>
                  
                  <div className="mt-auto pt-8 border-t border-white/10">
                     <div className="flex justify-between items-center mb-4">
                        <div className="text-lg font-black">{opp.marketGapScore}%</div>
                        <div className="text-[10px] font-black text-indigo-500 uppercase">فجوة السوق</div>
                     </div>
                     <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8">
                        <div className="bg-indigo-500 h-full" style={{ width: `${opp.marketGapScore}%` }}></div>
                     </div>

                     <button 
                        onClick={() => handleInject(opp)}
                        className="w-full py-5 bg-white text-slate-900 rounded-3xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl"
                     >
                        حقن في خط الإنتاج (Inject)
                     </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NexusPrimeDashboard;
