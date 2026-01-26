
import React, { useState, useEffect } from 'react';
import { Domain } from '../types';
import { getAuctionIntelligenceAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
}

const AuctionWatchDashboard: React.FC<Props> = ({ domains }) => {
  const [intel, setIntel] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchIntel = async () => {
    setIsLoading(true);
    // Explicitly type sectors as string[] to avoid unknown[] inference
    const sectors: string[] = Array.from(new Set(domains.map(d => d.sector || 'Technology')));
    const data = await getAuctionIntelligenceAI(sectors.slice(0, 5));
    setIntel(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (domains.length > 0) fetchIntel();
  }, []);

  return (
    <div className="space-y-10 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Auction & Flow Radar</h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time market liquidity tracking</p>
        </div>
        <button 
          onClick={fetchIntel}
          className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center gap-3 shadow-xl"
        >
          {isLoading ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-satellite-dish"></i> Refresh Signal</>}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Heatmap Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white p-10 rounded-[40px] border shadow-sm">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Sector Liquidity Heatmap</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {intel?.hotSectors.map((sector: any, i: number) => (
                  <div key={i} className="p-6 rounded-3xl border border-slate-100 flex flex-col justify-between h-32 group hover:border-indigo-500 transition-all relative overflow-hidden bg-slate-50/50">
                    <div className="relative z-10">
                       <div className="text-[9px] font-black text-slate-400 uppercase mb-1">{sector.trend}</div>
                       <div className="font-black text-slate-900">{sector.name}</div>
                    </div>
                    <div className="relative z-10 flex items-center justify-between">
                       <span className={`text-xl font-black ${sector.heatScore > 75 ? 'text-red-500' : 'text-indigo-600'}`}>{sector.heatScore}%</span>
                       <i className={`fas fa-arrow-${sector.trend === 'Rising' ? 'up text-green-500' : 'down text-red-400'} text-xs`}></i>
                    </div>
                    <div className="absolute bottom-0 left-0 h-1 bg-indigo-500" style={{ width: `${sector.heatScore}%` }}></div>
                  </div>
                ))}
                {!intel && isLoading && [1,2,3].map(i => <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl"></div>)}
              </div>
           </div>

           {/* Live Sales Ticker */}
           <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Confirmed Global Sales (24h)</h3>
                 <span className="bg-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[9px] font-black">LIVE FEED</span>
              </div>
              <div className="space-y-4">
                 {intel?.recentSales.map((sale: any, i: number) => (
                   <div key={i} className="flex justify-between items-center p-5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                            <i className="fas fa-tag"></i>
                         </div>
                         <div>
                            <div className="font-black text-sm tracking-tight">{sale.domain}</div>
                            <div className="text-[9px] font-black text-slate-500 uppercase">{sale.platform}</div>
                         </div>
                      </div>
                      <div className="text-xl font-black text-indigo-400">${sale.price.toLocaleString()}</div>
                   </div>
                 ))}
              </div>
              <i className="fas fa-waveform absolute right-[-20px] bottom-[-20px] text-white/5 text-[150px]"></i>
           </div>
        </div>

        {/* Actionable Alerts */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[40px] border shadow-sm flex flex-col h-full">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
                <i className="fas fa-exclamation-triangle text-amber-500"></i> Tactical Pricing Alerts
              </h3>
              <div className="flex-1 space-y-6">
                 {intel?.strategicAlerts.map((alert: any, i: number) => (
                   <div key={i} className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 space-y-4">
                      <div className="flex justify-between items-start">
                         <span className="text-[9px] font-black text-indigo-600 uppercase bg-white px-3 py-1 rounded-full shadow-sm">{alert.sector}</span>
                         <i className="fas fa-bolt text-indigo-600 animate-pulse"></i>
                      </div>
                      <div className="text-sm font-black text-slate-900 leading-tight">
                         {alert.action}
                      </div>
                      <p className="text-[10px] text-indigo-900/60 font-medium leading-relaxed italic">
                         "{alert.reason}"
                      </p>
                      <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 hover:scale-[1.02] transition-all">
                         Apply Strategy
                      </button>
                   </div>
                 ))}
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                 <div className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest">Quick Auction Exit</div>
                 <button className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-colors">
                    Push To Quick Auction
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionWatchDashboard;
