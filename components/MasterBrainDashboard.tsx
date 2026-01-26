
import React from 'react';
import { PlatformStats, ActivityLog, PlatformStrategy } from '../types';
import AnalyticsDashboard from './AnalyticsDashboard';

interface Props {
  stats: PlatformStats;
  activityLogs: ActivityLog[];
  strategy: PlatformStrategy;
  setStrategy: React.Dispatch<React.SetStateAction<PlatformStrategy>>;
  onInitiateScan?: () => void;
  isScanning?: boolean;
}

const MasterBrainDashboard: React.FC<Props> = ({ stats, activityLogs, strategy, setStrategy, onInitiateScan, isScanning }) => {
  const isFirstRun = stats.totalDiscovered === 0;

  return (
    <div className="space-y-10">
      {isFirstRun ? (
        <div className="bg-slate-900 rounded-[60px] p-20 text-white relative overflow-hidden shadow-2xl border border-white/5 animate-fade-in">
           <div className="max-w-2xl relative z-10">
              <h2 className="text-5xl font-black tracking-tighter mb-8 leading-none">Global Market <br/><span className="text-indigo-500">Neutrality Scanner</span></h2>
              <p className="text-lg text-slate-400 leading-relaxed mb-12">
                This terminal is currently idle. Initiate a <strong>Global Market Synthesis</strong> to scan NameBio, DNJournal, and Venture Capital flows using grounded AI intelligence.
              </p>
              <button 
                onClick={onInitiateScan}
                disabled={isScanning}
                className="bg-white text-slate-900 px-12 py-6 rounded-[32px] text-xs font-black uppercase tracking-[0.3em] hover:bg-indigo-500 hover:text-white transition-all shadow-2xl flex items-center gap-6"
              >
                {isScanning ? <i className="fas fa-sync-alt fa-spin"></i> : <><i className="fas fa-satellite"></i> Initiate First Market Scan</>}
              </button>
           </div>
           <i className="fas fa-brain absolute right-[-50px] bottom-[-50px] text-white/5 text-[400px]"></i>
           <div className="absolute top-10 right-10 flex gap-4">
              <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[9px] font-black uppercase tracking-widest text-indigo-400">
                 <i className="fas fa-check-circle"></i> No Hallucination Mode
              </div>
           </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-white p-10 rounded-[40px] border shadow-sm flex items-center justify-between relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Strategic Alpha Pulse</h3>
              <div className="flex items-baseline gap-6">
                 <span className="text-6xl font-black text-slate-900 tracking-tighter">Aggressive</span>
                 <div className="flex gap-1 items-center bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-sm">
                   <span className="w-2 h-2 bg-indigo-500 rounded-full animate-ping"></span>
                   High Liquidity Focus
                 </div>
              </div>
              <p className="mt-6 text-slate-500 text-sm max-w-lg font-medium leading-relaxed">
                Monitoring global domain auctions and venture capital flow. Current strategy: <span className="text-indigo-600 font-black">Capital preservation through premium .com accumulation.</span>
              </p>
            </div>
            <div className="hidden md:flex h-40 w-64 items-center justify-center relative">
               <div className="absolute inset-0 bg-indigo-50/50 rounded-full scale-150 blur-3xl opacity-30"></div>
               <i className="fas fa-chart-line text-[100px] text-indigo-100"></i>
            </div>
          </div>
          
          <div className="bg-indigo-600 p-10 rounded-[40px] text-white shadow-2xl shadow-indigo-100 flex flex-col justify-between relative overflow-hidden">
             <div className="relative z-10">
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-1">Portfolio Liquidity</div>
                <div className="text-5xl font-black">8.4<span className="text-xl text-indigo-300">/10</span></div>
             </div>
             <button className="relative z-10 w-full bg-white text-indigo-600 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all shadow-lg">
                Rebalance Assets
             </button>
             <i className="fas fa-water absolute bottom-[-20px] left-[-10px] text-white/5 text-[120px]"></i>
          </div>
        </div>
      )}

      {!isFirstRun && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h4 className="text-lg font-black text-slate-800 flex items-center gap-3">
                        <i className="fas fa-bullseye text-red-500"></i> Market Sniper Activity
                     </h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Real-time Opportunity Monitoring</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black rounded-full border border-green-100 uppercase">Active Scan</div>
                  </div>
               </div>
               
               <div className="space-y-4">
                  {[
                    { domain: 'ai-nexus.com', event: 'Registry Expiry approaching', status: 'watching' },
                    { domain: 'fintech-flow.com', event: 'Price drop on Sedo', status: 'alert' }
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${alert.status === 'alert' ? 'bg-red-100 text-red-600' : 'bg-indigo-100 text-indigo-600'}`}>
                             <i className={`fas ${alert.status === 'alert' ? 'fa-exclamation-triangle' : 'fa-eye'} text-xs`}></i>
                          </div>
                          <div>
                             <div className="text-sm font-black text-slate-800">{alert.domain}</div>
                             <div className="text-[10px] text-slate-500 font-medium">{alert.event}</div>
                          </div>
                       </div>
                       <button className="px-4 py-1.5 bg-white text-slate-900 border border-slate-200 rounded-xl text-[10px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">
                          Execute Buy
                       </button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-[#0b0e14] rounded-[40px] p-10 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
               <div className="flex justify-between items-center mb-12">
                  <h3 className="text-xl font-black flex items-center gap-4 uppercase tracking-tighter">
                    <i className="fas fa-brain text-indigo-400"></i> Investment Logic Controller
                  </h3>
                  <div className="flex gap-2">
                    <span className="bg-slate-800 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase">Professional Tier</span>
                  </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                  <div className="space-y-10">
                     <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Liquidity Target</span>
                          <span className="text-indigo-400">High Velocity (Flip)</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <button className="py-4 bg-indigo-600 rounded-2xl text-[10px] font-black shadow-lg shadow-indigo-500/20">QUICK FLIP</button>
                          <button className="py-4 bg-slate-800 rounded-2xl text-[10px] font-black text-slate-500 border border-slate-700">STORE OF VALUE</button>
                        </div>
                     </div>
                     
                     <div className="space-y-6">
                        <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          <span>Acquisition Speed</span>
                          <span className="text-indigo-400 font-mono">Aggressive</span>
                        </div>
                        <input 
                          type="range" min="1" max="100" 
                          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                          defaultValue={85}
                        />
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-slate-800/30 rounded-3xl p-8 border border-slate-800/50 relative">
                        <div className="flex items-center gap-6 mb-6">
                           <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                             <i className="fas fa-fingerprint"></i>
                           </div>
                           <div>
                              <div className="text-sm font-black">OSINT Trademark Guard</div>
                              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Automatic Compliance</div>
                           </div>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                          "Your portfolio is currently 98% compliant with USPTO/EUIPO standards. High safety margin."
                        </p>
                     </div>
                  </div>
               </div>
            </div>
            
            <AnalyticsDashboard stats={stats} />
          </div>
          
          <div className="bg-white rounded-[40px] border shadow-sm flex flex-col h-[800px] overflow-hidden">
            <div className="p-10 border-b flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">Logic Stream</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Grounding Processor Activity</p>
              </div>
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                 <i className="fas fa-terminal text-xs"></i>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex gap-6 items-start group relative">
                  <div className="w-[1px] bg-slate-100 absolute left-[15px] top-10 bottom-[-32px] group-last:hidden"></div>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 z-10 shadow-sm border ${
                    log.type === 'success' ? 'bg-green-50 border-green-100 text-green-600' : 
                    log.type === 'warning' ? 'bg-orange-50 border-orange-100 text-orange-600' : 
                    log.type === 'critical' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-slate-100 text-indigo-500'
                  }`}>
                    <i className={`fas ${
                      log.agent === 'Discovery' ? 'fa-search' : 
                      log.agent === 'Evaluation' ? 'fa-shield-alt' : 
                      log.agent === 'Auto-Pilot' ? 'fa-bolt' : 'fa-brain'
                    } text-[10px]`}></i>
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{log.agent}</span>
                      <span className="text-[9px] font-mono text-slate-300">{log.time}</span>
                    </div>
                    <p className="text-sm text-slate-700 mt-2 leading-relaxed font-medium">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterBrainDashboard;
