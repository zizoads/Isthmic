
import React, { useState } from 'react';
import { NexusOpportunity, Domain } from '../types';
import { nexusPrimeIntelligenceAI } from '../services/geminiService';
import { translations } from '../translations';

interface Props {
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const NexusPrimeDashboard: React.FC<Props> = ({ addLog, setDomains, lang }) => {
  const t = translations[lang];
  const [isThinking, setIsThinking] = useState(false);
  const [verdict, setVerdict] = useState<string | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<NexusOpportunity[]>([]);
  const [activeMode, setActiveMode] = useState<'Arbitrage' | 'Temporal' | 'Forensic' | 'DNA_Audit'>('Temporal');

  const handleActivateNexus = async () => {
    setIsThinking(true);
    addLog('Nexus Prime', `Initializing Protocol: ${activeMode}...`, 'info');
    
    const context = activeMode === 'Temporal'
      ? 'Forecast the next big keywords based on trending tech papers.'
      : activeMode === 'DNA_Audit'
      ? 'Search for hidden SEO value in expired high-authority assets.'
      : 'Analyze arbitrage opportunities and trademark risks.';

    const result = await nexusPrimeIntelligenceAI(activeMode, context, lang);
    
    if (result) {
      setVerdict(result.analysisVerdict);
      setRiskAssessment(result.strategicRiskAssessment);
      setOpportunities(result.opportunities);
      addLog('Nexus Prime', 'Strategy synthesis complete.', 'success');
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
    addLog('System', `Opportunity injected.`, 'success');
  };

  return (
    <div className="space-y-6 lg:space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-br from-[#05070a] to-[#161b22] p-8 lg:p-14 rounded-[40px] text-white shadow-2xl relative border border-indigo-500/20">
        <div className="relative z-10 max-w-5xl">
           <div className={`flex flex-col lg:flex-row items-center gap-6 mb-8 text-center ${lang === 'ar' ? 'lg:text-right' : 'lg:text-left'}`}>
              <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-3xl shadow-lg border border-indigo-400/50">
                 <i className="fas fa-atom"></i>
              </div>
              <div>
                 <h2 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tighter">NEXUS PRIME <span className="text-indigo-500 font-light">PRO</span></h2>
                 <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">{t.nexusWelcome}</p>
              </div>
           </div>
           
           <p className={`text-slate-300 text-sm lg:text-lg italic font-medium mb-10 border-indigo-500 bg-white/5 p-6 rounded-2xl ${lang === 'ar' ? 'border-r-4' : 'border-l-4'}`}>
             {t.nexusIntro}
           </p>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
              {(['Temporal', 'DNA_Audit', 'Arbitrage', 'Forensic'] as const).map(mode => (
                <button 
                  key={mode}
                  onClick={() => setActiveMode(mode)}
                  className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                    activeMode === mode 
                    ? 'bg-indigo-600 border-indigo-400 text-white' 
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {mode}
                </button>
              ))}
           </div>

           <button 
             onClick={handleActivateNexus}
             disabled={isThinking}
             className="w-full lg:w-auto bg-white text-slate-900 px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-xl flex items-center justify-center gap-3"
           >
             {isThinking ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-bolt"></i>}
             {isThinking ? t.thinking : t.startInference}
           </button>
        </div>
      </div>

      {verdict && (
        <div className="space-y-6 lg:space-y-10">
          <div className="bg-white dark:bg-slate-900 p-8 lg:p-12 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl">
             <div className={`flex flex-col lg:flex-row justify-between gap-8 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex-1">
                   <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-4">{t.verdict}</h3>
                   <p className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-6">"{verdict}"</p>
                   <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400 text-sm">
                      {t.riskAssessment}: {riskAssessment}
                   </div>
                </div>
                <div className="bg-slate-900 dark:bg-indigo-900 p-8 rounded-3xl text-white text-center flex flex-col justify-center min-w-[200px]">
                   <div className="text-[9px] font-black text-indigo-400 uppercase mb-2">{t.confidence}</div>
                   <div className="text-4xl font-black">99.2%</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-8 bg-slate-900 rounded-[35px] text-white border border-white/5 flex flex-col h-full shadow-2xl hover:border-indigo-500 transition-all">
                <div className={`flex justify-between items-start mb-6 ${lang === 'ar' ? 'text-right flex-row-reverse' : 'text-left flex-row'}`}>
                   <span className="bg-indigo-600 px-3 py-1 rounded-lg text-[8px] font-black uppercase">{opp.type}</span>
                   <div>
                      <h4 className="font-black text-xl text-white">{opp.title}</h4>
                      <div className="text-xl font-black text-indigo-400 mt-1">{opp.estimatedValue}</div>
                   </div>
                </div>
                
                <p className={`text-xs text-slate-400 leading-relaxed mb-8 italic flex-1 ${lang === 'ar' ? 'text-right border-r-2 pr-4' : 'text-left border-l-2 pl-4'} border-white/10`}>
                  "{opp.description}"
                </p>
                
                <div className="pt-6 border-t border-white/10">
                   <div className="flex justify-between items-center mb-3">
                      <div className="text-lg font-black">{opp.marketGapScore}%</div>
                      <div className="text-[8px] font-black text-indigo-500 uppercase">{t.marketGap}</div>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-6">
                      <div className="bg-indigo-500 h-full" style={{ width: `${opp.marketGapScore}%` }}></div>
                   </div>
                   <button 
                      onClick={() => handleInject(opp)}
                      className="w-full py-4 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                   >
                      {t.inject}
                   </button>
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
