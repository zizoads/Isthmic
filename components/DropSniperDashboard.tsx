
import React, { useState } from 'react';
import { getDropSniperListAI, analyzeSnipeOpportunityAI } from '../services/geminiService';
import { translations } from '../translations';
import { useDomainContext } from '../context/DomainContext';
import { NotificationService } from '../services/NotificationService';

interface Props {
  lang: 'ar' | 'en';
}

const DropSniperDashboard: React.FC<Props> = ({ lang }) => {
  const t = translations[lang];
  const { activeProfile, addLog, integrations } = useDomainContext();
  const [sector, setSector] = useState('Artificial Intelligence');
  const [snipes, setSnipes] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSnipe, setSelectedSnipe] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBackordering, setIsBackordering] = useState<string | null>(null);

  const isDropApiConnected = integrations.some(i => i.provider === 'drop_api' && i.status === 'connected');

  const handleScan = async () => {
    setIsScanning(true);
    const list = await getDropSniperListAI(sector);
    setSnipes(list);
    setIsScanning(false);
  };

  const handleBackorder = async (snipe: any) => {
    setIsBackordering(snipe.domain);
    // Simulated API call to Dynadot/DropCatch
    await new Promise(r => setTimeout(r, 2000));
    addLog('Sniper', `Backorder protocol armed for ${snipe.domain}. Monitoring release milliseconds.`, 'success');
    setIsBackordering(null);
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
        <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">{t.dropSniper}</h2>
          <p className="text-xs text-red-500 font-black uppercase tracking-widest mt-1 flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span> 
            {isDropApiConnected ? (lang === 'ar' ? 'بروتوكول الحجز الآلي مسلح.' : 'Backorder API armed.') : (lang === 'ar' ? 'وضع المراقبة فقط.' : 'Monitor-only mode.')}
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className={`flex-1 bg-[#0b0e14] border border-white/10 px-8 py-5 rounded-[22px] text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20 text-white ${lang === 'ar' ? 'text-right' : 'text-left'}`}
            placeholder={t.targetNiche}
          />
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-red-600 text-white px-10 py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-900/20 flex items-center gap-4"
          >
            {isScanning ? <i className="fas fa-radar fa-spin"></i> : <><i className="fas fa-crosshairs"></i> {t.sweepTarget}</>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[850px] pr-2 scrollbar-hide">
          {snipes.map((snipe, i) => (
            <div 
              key={i} 
              onClick={() => handleDeepAnalysis(snipe)}
              className={`p-10 rounded-[50px] border transition-all cursor-pointer group relative overflow-hidden ${
                selectedSnipe?.domain === snipe.domain ? 'bg-red-900/10 border-red-500/30 shadow-2xl' : 'bg-[#08090d] border-white/5 hover:border-red-500/20'
              }`}
            >
              <div className={`flex justify-between items-start relative z-10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                 <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{snipe.domain}</h3>
                    <div className="flex gap-4 mt-4">
                       <span className="text-[9px] font-black text-red-500 uppercase bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full">
                         {t.dropDate}: {snipe.dropDate}
                       </span>
                       <span className="text-[9px] font-black text-slate-500 uppercase bg-white/5 px-4 py-1.5 rounded-full border border-white/5">
                         {t.authority}: {snipe.estimatedAuthority}/100
                       </span>
                    </div>
                 </div>
                 <div className={lang === 'ar' ? 'text-left' : 'text-right'}>
                    <div className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">{t.estimatedValue}</div>
                    <div className="text-3xl font-black text-white tracking-tighter">${snipe.estimatedValue.toLocaleString()}</div>
                 </div>
              </div>
              
              <p className={`mt-8 text-xs text-slate-400 font-medium leading-relaxed italic line-clamp-2 border-r-4 border-white/5 pr-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                "{snipe.reasonToSnipe}"
              </p>

              <div className="mt-10 flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-red-500 text-xs shadow-xl"><i className="fas fa-bolt"></i></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gateway: <span className="text-white">{snipe.backorderPlatform}</span></span>
                 </div>
                 <button className="text-[9px] font-black text-red-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all flex items-center gap-3">
                    {t.auditAction} <i className={`fas ${lang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
                 </button>
              </div>
              <i className="fas fa-crosshairs absolute right-[-40px] bottom-[-40px] text-white/2 text-[200px] pointer-events-none group-hover:scale-110 transition-transform"></i>
            </div>
          ))}
          {snipes.length === 0 && !isScanning && (
            <div className="h-80 bg-[#08090d] border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center justify-center text-slate-700 space-y-6">
               <i className="fas fa-binoculars text-7xl opacity-20"></i>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">{t.awaitingSignal}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
           <div className="bg-[#05070a] text-white rounded-[50px] p-12 shadow-2xl sticky top-8 min-h-[650px] border border-white/10 overflow-hidden">
              {!selectedSnipe ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-700 text-center space-y-8 py-20">
                    <i className="fas fa-shield-virus text-8xl opacity-10"></i>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-[200px]">{t.awaitingAudit}</p>
                 </div>
              ) : isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-24 space-y-10">
                    <div className="relative">
                       <div className="w-24 h-24 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                       <i className="fas fa-fingerprint absolute inset-0 flex items-center justify-center text-red-600 text-3xl"></i>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center animate-pulse tracking-[0.3em]">{t.scanningRegistrars}</p>
                 </div>
              ) : deepAnalysis && (
                 <div className="space-y-12 animate-fade-in">
                    <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                       <div className="flex justify-between items-center mb-6">
                          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">{t.tacticalIntelligence}</h4>
                          <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                             deepAnalysis.verdict === 'Golden' ? 'bg-amber-400 text-black shadow-xl shadow-amber-900/20' : 'bg-white/5 text-slate-400 border border-white/10'
                          }`}>{deepAnalysis.verdict}</span>
                       </div>
                       <div className="text-4xl font-black tracking-tighter mb-4 italic uppercase">{selectedSnipe.domain}</div>
                    </div>

                    <div className="space-y-8">
                       <div className={`p-8 bg-white/2 rounded-[32px] border border-white/5 ${lang === 'ar' ? 'text-right border-r-4 border-red-500/20' : 'text-left border-l-4 border-red-500/20'}`}>
                          <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 italic">{t.historySummary}</h5>
                          <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
                             "{deepAnalysis.historySummary}"
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-white/2 rounded-3xl border border-white/5 text-center group hover:bg-red-500/5 transition-colors">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.flipProb}</div>
                             <div className="text-3xl font-black text-red-500">{deepAnalysis.flipProbability}%</div>
                          </div>
                          <div className="p-6 bg-white/2 rounded-3xl border border-white/5 text-center group hover:bg-white/5 transition-colors">
                             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{t.maxBid}</div>
                             <div className="text-3xl font-black text-white">${deepAnalysis.maxBackorderBid}</div>
                          </div>
                       </div>

                       <div className={`p-8 bg-red-950/20 rounded-[32px] border border-red-500/10 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-4 flex items-center gap-3">
                             <i className="fas fa-triangle-exclamation"></i> {t.trademarkAlert}
                          </h5>
                          <p className="text-xs text-red-200/70 font-bold leading-relaxed">
                             {deepAnalysis.trademarkAlert}
                          </p>
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/10">
                       {isDropApiConnected ? (
                         <button 
                          onClick={() => handleBackorder(selectedSnipe)}
                          disabled={isBackordering === selectedSnipe.domain}
                          className="w-full py-6 bg-red-600 text-white rounded-[28px] text-sm font-black uppercase tracking-widest hover:bg-red-500 shadow-2xl shadow-red-900/30 transition-all flex items-center justify-center gap-4"
                         >
                           {isBackordering === selectedSnipe.domain ? <i className="fas fa-dna fa-spin"></i> : <><i className="fas fa-bolt"></i> {t.backorderActive}</>}
                         </button>
                       ) : (
                         <button className="w-full py-6 bg-white/5 text-slate-500 rounded-[28px] text-sm font-black uppercase tracking-widest cursor-not-allowed border border-white/5">
                            API DISCONNECTED
                         </button>
                       )}
                    </div>
                 </div>
              )}
              <i className="fas fa-skull-crossbones absolute left-[-40px] top-[-40px] text-white/2 text-[250px] pointer-events-none -rotate-12"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DropSniperDashboard;
