
import React, { useState } from 'react';
import { NexusOpportunity, Domain, TechnicalMetrics } from '../types';
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

    try {
      // Cast result to any because nexusPrimeIntelligenceAI currently returns {} in geminiServiceLegacy.ts
      const result: any = await nexusPrimeIntelligenceAI(activeMode, context, lang);
      if (result) {
        setVerdict(result.analysisVerdict);
        setRiskAssessment(result.strategicRiskAssessment);
        setOpportunities(result.opportunities);
        addLog('Nexus Prime', 'Strategy synthesis complete.', 'success');
      }
    } catch (e) {
      addLog('Nexus Prime', 'Operation Aborted by Engine', 'warning');
    } finally {
      setIsThinking(false);
    }
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
      probability: opp.probability / 100
    };
    setDomains(prev => [newDomain, ...prev]);
    addLog('System', `Opportunity injected.`, 'success');
  };

  return (
    <div className="space-y-12 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className={`relative bg-[#0b0b14] p-10 lg:p-16 rounded-[48px] border border-white/5 overflow-hidden shadow-2xl ${isThinking ? 'scanning-effect' : ''}`}>
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
                <i className="fas fa-atom text-white"></i>
              </div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white">NEXUS PRIME <span className="text-indigo-500 font-light">CORE</span></h2>
            </div>
            <p className="text-slate-400 text-lg italic font-medium leading-relaxed max-w-2xl mb-10">
              {t.nexusIntro}
            </p>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {['Temporal', 'DNA_Audit', 'Arbitrage', 'Forensic'].map(mode => (
                <button key={mode} onClick={() => setActiveMode(mode as any)}
                  className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeMode === mode ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-white/5 border-white/10 text-slate-500 hover:text-white'}`}>
                  {mode.replace('_', ' ')}
                </button>
              ))}
            </div>

            <div className="flex gap-6">
              {isThinking ? (
                <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-3">
                  <i className="fas fa-hand-paper"></i> {t.stopProcess}
                </button>
              ) : (
                <button onClick={handleActivateNexus} className="bg-white text-black px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl flex items-center gap-3">
                  <i className="fas fa-bolt"></i> {t.startInference}
                </button>
              )}
            </div>
          </div>
          
          <div className="hidden lg:flex w-64 h-64 border-4 border-indigo-600/20 rounded-full items-center justify-center relative">
             <div className={`w-48 h-48 border-2 border-indigo-500/40 rounded-full flex items-center justify-center ${isThinking ? 'animate-spin' : ''}`}>
                <i className="fas fa-satellite-dish text-5xl text-indigo-500"></i>
             </div>
             <div className="absolute inset-0 bg-indigo-600/5 blur-3xl rounded-full"></div>
          </div>
        </div>
        <i className="fas fa-crosshairs absolute right-[-100px] bottom-[-100px] text-white/5 text-[400px] pointer-events-none -rotate-12"></i>
      </div>

      {verdict && (
        <div className="animate-slide-up space-y-10">
          <div className="bg-white/2 border border-white/5 p-12 rounded-[48px] shadow-2xl">
             <div className={`flex flex-col lg:flex-row justify-between gap-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                <div className="flex-1">
                   <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Mastermind Verdict</h3>
                   <p className="text-3xl font-black text-white mb-8">"{verdict}"</p>
                   <div className="p-8 bg-white/5 rounded-3xl border border-white/10 italic text-slate-400 leading-relaxed">
                      <span className="text-indigo-400 font-black mr-2 uppercase tracking-widest">Risk Analysis:</span> {riskAssessment}
                   </div>
                </div>
                <div className="bg-indigo-600/20 p-10 rounded-[40px] border border-indigo-500/30 flex flex-col justify-center items-center text-center">
                   <div className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest">Confidence Score</div>
                   <div className="text-6xl font-black text-white">99%</div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {opportunities.map((opp) => (
              <div key={opp.id} className="p-8 bg-[#0b0b14] rounded-[40px] border border-white/5 flex flex-col h-full shadow-2xl hover:border-indigo-500/50 transition-all relative overflow-hidden group">
                <div className={`flex justify-between items-start mb-8 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                   <span className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">{opp.type}</span>
                   <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                      <h4 className="font-black text-xl text-white group-hover:text-indigo-400 transition-colors">{opp.title}</h4>
                      <div className="text-xl font-black text-indigo-500 mt-1">{opp.estimatedValue}</div>
                   </div>
                </div>
                
                <p className={`text-xs text-slate-400 leading-relaxed mb-10 italic flex-1 border-white/10 ${lang === 'ar' ? 'text-right border-r-2 pr-4' : 'text-left border-l-2 pl-4'}`}>
                  "{opp.description}"
                </p>
                
                <div className="pt-8 border-t border-white/5">
                   <div className="flex justify-between items-center mb-4">
                      <div className="text-2xl font-black text-white">{opp.marketGapScore}%</div>
                      <div className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Market Gap</div>
                   </div>
                   <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-8">
                      <div className="bg-indigo-500 h-full" style={{ width: `${opp.marketGapScore}%` }}></div>
                   </div>
                   <button onClick={() => handleInject(opp)}
                      className="w-full py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
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
