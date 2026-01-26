
import React, { useState } from 'react';
import { getDropSniperListAI, analyzeSnipeOpportunityAI } from '../services/geminiService';

const DropSniperDashboard: React.FC = () => {
  const [sector, setSector] = useState('Artificial Intelligence');
  const [snipes, setSnipes] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSnipe, setSelectedSnipe] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleScan = async () => {
    setIsScanning(true);
    const list = await getDropSniperListAI(sector);
    setSnipes(list);
    setIsScanning(false);
  };

  const handleDeepAnalysis = async (snipe: any) => {
    setIsAnalyzing(true);
    setSelectedSnipe(snipe);
    const result = await analyzeSnipeOpportunityAI(snipe.domain);
    setDeepAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">Drop Sniper Radar</h2>
          <p className="text-xs text-red-500 font-black uppercase tracking-widest mt-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-ping"></span> Live Pending-Delete Monitor
          </p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <input 
            type="text" 
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-red-500/20"
            placeholder="Target Niche..."
          />
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-red-100 flex items-center gap-3"
          >
            {isScanning ? <i className="fas fa-radar fa-spin"></i> : <><i className="fas fa-crosshairs"></i> Sweep Target Sector</>}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Drop Feed */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto max-h-[800px] pr-2 scrollbar-hide">
          {snipes.map((snipe, i) => (
            <div 
              key={i} 
              onClick={() => handleDeepAnalysis(snipe)}
              className={`p-8 rounded-[40px] border transition-all cursor-pointer group relative overflow-hidden ${
                selectedSnipe?.domain === snipe.domain ? 'bg-red-50 border-red-200 shadow-xl' : 'bg-white hover:border-red-300'
              }`}
            >
              <div className="flex justify-between items-start relative z-10">
                 <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{snipe.domain}</h3>
                    <div className="flex gap-3 mt-2">
                       <span className="text-[9px] font-black text-red-600 uppercase bg-red-100 px-3 py-1 rounded-full">
                         Drops: {snipe.dropDate}
                       </span>
                       <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-100 px-3 py-1 rounded-full">
                         Authority: {snipe.estimatedAuthority}/100
                       </span>
                    </div>
                 </div>
                 <div className="text-right">
                    <div className="text-[9px] font-black text-slate-400 uppercase mb-1">Estimated Value</div>
                    <div className="text-2xl font-black text-slate-900">${snipe.estimatedValue.toLocaleString()}</div>
                 </div>
              </div>
              
              <p className="mt-6 text-xs text-slate-500 font-medium leading-relaxed italic line-clamp-2">
                "{snipe.reasonToSnipe}"
              </p>

              <div className="mt-8 flex justify-between items-center relative z-10">
                 <div className="flex items-center gap-2">
                    <i className="fas fa-bolt text-amber-500 text-xs"></i>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Backorder on: <span className="text-slate-900">{snipe.backorderPlatform}</span></span>
                 </div>
                 <button className="text-[10px] font-black text-red-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Run Analysis <i className="fas fa-chevron-right ml-2"></i>
                 </button>
              </div>
              <i className="fas fa-bullseye absolute right-[-20px] bottom-[-20px] text-red-500/5 text-[150px] group-hover:scale-110 transition-transform"></i>
            </div>
          ))}
          {snipes.length === 0 && !isScanning && (
            <div className="h-64 bg-slate-50 border border-dashed rounded-[40px] flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-binoculars text-4xl mb-4"></i>
               <p className="text-sm italic">Run a sweep to identify dropping assets.</p>
            </div>
          )}
        </div>

        {/* Tactical Intelligence Console */}
        <div className="lg:col-span-1">
           <div className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl sticky top-8 min-h-[600px] border border-white/5 overflow-hidden">
              {!selectedSnipe ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center space-y-6 py-20">
                    <i className="fas fa-shield-virus text-6xl opacity-20"></i>
                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">Select a target from the feed to engage deep tactical audit.</p>
                 </div>
              ) : isAnalyzing ? (
                 <div className="flex flex-col items-center justify-center py-20 space-y-8">
                    <div className="relative">
                       <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                       <i className="fas fa-fingerprint absolute inset-0 flex items-center justify-center text-red-600 text-2xl"></i>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Auditing Registry History & IP Risks...</p>
                 </div>
              ) : deepAnalysis && (
                 <div className="space-y-10 animate-fade-in">
                    <div>
                       <div className="flex justify-between items-center mb-4">
                          <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest">Pre-Snipe Verdict</h4>
                          <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase ${
                             deepAnalysis.verdict === 'Golden' ? 'bg-amber-400 text-black' : 'bg-slate-800 text-white'
                          }`}>{deepAnalysis.verdict} Snipe</span>
                       </div>
                       <div className="text-4xl font-black tracking-tighter mb-4">{selectedSnipe.domain}</div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
                          <h5 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Historical Pulse</h5>
                          <p className="text-xs text-slate-300 leading-relaxed font-medium italic">
                             "{deepAnalysis.historySummary}"
                          </p>
                       </div>

                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                             <div className="text-[8px] font-black text-slate-500 uppercase">Flip Prob.</div>
                             <div className="text-2xl font-black text-red-500">{deepAnalysis.flipProbability}%</div>
                          </div>
                          <div className="p-5 bg-white/5 rounded-2xl border border-white/10">
                             <div className="text-[8px] font-black text-slate-500 uppercase">Max Bid</div>
                             <div className="text-2xl font-black text-white">${deepAnalysis.maxBackorderBid}</div>
                          </div>
                       </div>

                       <div className="p-6 bg-red-900/30 rounded-3xl border border-red-500/20">
                          <h5 className="text-[9px] font-black text-red-400 uppercase tracking-widest mb-3">Trademark Guard</h5>
                          <p className="text-xs text-red-200 font-bold leading-relaxed">
                             {deepAnalysis.trademarkAlert}
                          </p>
                       </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 space-y-4">
                       <button className="w-full py-5 bg-red-600 text-white rounded-[24px] text-sm font-black uppercase tracking-widest hover:bg-red-500 shadow-2xl shadow-red-900/20 transition-all">
                          Place Backorder Strike
                       </button>
                       <p className="text-[8px] text-slate-500 text-center font-black uppercase">Executing via {selectedSnipe.backorderPlatform} API</p>
                    </div>
                 </div>
              )}
              <i className="fas fa-crosshairs absolute left-[-50px] top-[-50px] text-white/5 text-[300px] pointer-events-none"></i>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DropSniperDashboard;
