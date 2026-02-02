
import React, { useState, useEffect } from 'react';
import { getDropSniperListAI, analyzeSnipeOpportunityAI } from '../services/ai/DiscoveryService';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';
import { NotificationService } from '../services/NotificationService';
import { OrchestrationService } from '../services/ai/OrchestrationService';
import { StrategicObjective } from '../types';

interface Props {
  lang: 'ar' | 'en';
}

const DropSniperDashboard: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const { activeProfile, addLog, strategy } = useDomainContext();
  const [sector, setSector] = useState('Artificial Intelligence');
  const [snipes, setSnipes] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSnipe, setSelectedSnipe] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [objectives, setObjectives] = useState<StrategicObjective[]>([]);

  useEffect(() => {
    if (strategy.investmentThesis) {
      OrchestrationService.generateInitialObjectives(strategy.investmentThesis).then(setObjectives);
    }
  }, [strategy.investmentThesis]);

  const handleScan = async () => {
    setIsScanning(true);
    addLog('Sniper', lang === 'ar' ? 'بدء فحص الرادار للأهداف الاستراتيجية...' : 'Initiating strategic radar sweep...', 'info');
    const list = await getDropSniperListAI(sector, objectives);
    setSnipes(list);
    setIsScanning(false);
  };

  const handleExternalBackorder = (snipe: any) => {
    addLog('Redirector', `Redirecting to Dynadot Backorder for ${snipe.domain}...`, 'info');
    const url = `https://www.dynadot.com/domain/backorder?domain=${encodeURIComponent(snipe.domain)}`;
    window.open(url, '_blank');
  };

  const handleDeepAnalysis = async (snipe: any) => {
    setIsAnalyzing(true);
    setSelectedSnipe(snipe);
    const result = await analyzeSnipeOpportunityAI(snipe.domain);
    setDeepAnalysis(result);
    setIsAnalyzing(false);

    if (result.verdict === 'Golden' && activeProfile?.preferences?.emailAlerts) {
      await NotificationService.sendTransactionalEmail(activeProfile.email, 'GOLDEN_SNIPER', {
        domain: snipe.domain,
        value: snipe.estimatedValue,
        verdict: result.verdict
      });
      addLog('System', lang === 'ar' ? `تم إرسال تنبيه ذهبي إلى ${activeProfile.email}` : `Golden Alert dispatched to ${activeProfile.email}`, 'success');
    }
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t.dropSniper}</h2>
          <div className="flex items-center gap-3 mt-1">
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_green]"></div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Sovereign Neural Link Active</span>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="flex-1 bg-[#0b0e14] border border-white/10 px-8 py-4 rounded-[22px] text-sm font-bold text-white outline-none focus:border-red-500/50 transition-all"
            placeholder={t.targetNiche}
          />
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-red-600 text-white px-10 py-4 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all shadow-xl shadow-red-900/20"
          >
            {isScanning ? <i className="fas fa-satellite fa-spin"></i> : <><i className="fas fa-crosshairs"></i> {t.sweepTarget}</>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6 max-h-[800px] overflow-y-auto no-scrollbar pr-2">
          {snipes.map((snipe, i) => (
            <div 
              key={i} 
              onClick={() => handleDeepAnalysis(snipe)}
              className={`p-10 rounded-[50px] border transition-all cursor-pointer relative overflow-hidden group ${
                selectedSnipe?.domain === snipe.domain ? 'bg-red-900/10 border-red-500/30' : 'bg-[#08090d] border-white/5 hover:border-red-500/20'
              }`}
            >
              <div className="flex justify-between items-start relative z-10">
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{snipe.domain}</h3>
                    <div className="flex gap-4 mt-4">
                       <span className="text-[9px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-full uppercase">Drop: {snipe.dropDate}</span>
                       <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${snipe.strategicAlignmentScore >= 80 ? 'bg-green-500/20 text-green-500' : 'bg-white/5 text-slate-500'}`}>
                          Align: {snipe.strategicAlignmentScore}%
                       </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-3xl font-black text-white italic">${snipe.estimatedValue.toLocaleString()}</div>
                    <div className="text-[8px] font-black text-slate-600 uppercase mt-1">Platform: {snipe.backorderPlatform}</div>
                 </div>
              </div>
              <p className="mt-8 text-xs text-slate-400 font-medium italic line-clamp-2 pr-10">"{snipe.reasonToSnipe}"</p>
              <i className="fas fa-bolt absolute right-[-40px] bottom-[-40px] text-white/[0.02] text-[200px] -rotate-12 transition-transform group-hover:scale-110"></i>
            </div>
          ))}
          {snipes.length === 0 && !isScanning && (
            <div className="py-40 text-center opacity-10">
               <i className="fas fa-crosshairs text-8xl mb-6"></i>
               <p className="text-sm font-black uppercase tracking-[0.5em]">Awaiting_Inference_Signal</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
           <div className="bg-[#05070a] border border-white/10 rounded-[50px] p-10 sticky top-8 min-h-[600px] flex flex-col justify-between overflow-hidden shadow-2xl">
              {!selectedSnipe ? (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-700 text-center py-20">
                   <i className="fas fa-fingerprint text-6xl mb-6 opacity-20"></i>
                   <p className="text-[10px] font-black uppercase tracking-widest max-w-[200px]">Select tactical unit for forensic dissection.</p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                   <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                   <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 animate-pulse">Scanning Global Registrars...</p>
                </div>
              ) : deepAnalysis && (
                <div className="space-y-10 animate-fade-in relative z-10">
                   <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Tactical Verdict</span>
                      <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${deepAnalysis.verdict === 'Golden' ? 'bg-amber-400 text-black' : 'bg-white/5 text-slate-500'}`}>{deepAnalysis.verdict}</span>
                   </div>
                   <h4 className="text-4xl font-black text-white italic tracking-tighter">{selectedSnipe.domain}</h4>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-white/2 border border-white/5 rounded-3xl text-center">
                         <div className="text-[8px] font-black text-slate-600 uppercase mb-2">Flip Prob.</div>
                         <div className="text-2xl font-black text-white">{deepAnalysis.flipProbability}%</div>
                      </div>
                      <div className="p-6 bg-white/2 border border-white/5 rounded-3xl text-center">
                         <div className="text-[8px] font-black text-slate-600 uppercase mb-2">Max Bid</div>
                         <div className="text-2xl font-black text-red-500">${deepAnalysis.maxBackorderBid}</div>
                      </div>
                   </div>

                   <div className="p-6 bg-white/2 border border-white/5 rounded-3xl">
                      <div className="text-[8px] font-black text-indigo-400 uppercase mb-3">Intelligence Narrative</div>
                      <p className="text-xs text-slate-400 leading-relaxed italic">"{deepAnalysis.tacticalIntelligence}"</p>
                   </div>

                   <button 
                    onClick={() => handleExternalBackorder(selectedSnipe)}
                    className="w-full py-6 bg-red-600 text-white rounded-[28px] text-[11px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all shadow-2xl flex items-center justify-center gap-4"
                   >
                     <i className="fas fa-external-link-alt"></i> Execute Backorder Sequence
                   </button>
                </div>
              )}
              <i className="fas fa-shield-virus absolute left-[-40px] top-[-40px] text-white/[0.01] text-[250px] pointer-events-none rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DropSniperDashboard;
