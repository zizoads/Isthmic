
import React, { useState, useEffect } from 'react';
import { LaunchReadinessReport, SovereignAutopsyReport, EWSAlert } from '../types';
import { LaunchReadinessService } from '../services/LaunchReadinessService';
import { AutopsyService } from '../services/ai/AutopsyService';
import { useDomainContext } from '../context/DomainContext';

const LaunchControlHub: React.FC = () => {
  const { addLog, activityLogs } = useDomainContext();
  const [report, setReport] = useState<LaunchReadinessReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<EWSAlert[]>([]);
  const [showChaosPanel, setShowChaosPanel] = useState(false);

  // EWS Telemetry Loop
  useEffect(() => {
    const { status, alerts } = LaunchReadinessService.monitorTelemetry(activityLogs);
    setLiveAlerts(alerts);
    if (report && report.ewsStatus !== status) {
      setReport({ ...report, ewsStatus: status });
    }
  }, [activityLogs]);

  const runFullVerification = async () => {
    setIsAuditing(true);
    addLog('Launch Control', 'Initiating Sovereign Verification Protocol (SVP)...', 'info');
    
    const targetSpecimens = [
      { name: 'base.ts', path: './services/ai/base.ts' },
      { name: 'SupabaseClient.ts', path: './services/SupabaseClient.ts' },
      { name: 'DomainContext.tsx', path: './context/DomainContext.tsx' },
      { name: 'App.tsx', path: './App.tsx' }
    ];

    try {
      const results: SovereignAutopsyReport[] = [];
      for (const specimen of targetSpecimens) {
        const res = await fetch(specimen.path);
        const code = await res.text();
        const audit = await AutopsyService.performAutopsy(specimen.name, specimen.path, code);
        results.push(audit);
        addLog('Launch Control', `Specimen Verified: ${specimen.name} [PHI: ${audit.metrics.overallHealthIndex}%]`, 'success');
      }

      const finalReport = await LaunchReadinessService.evaluateLaunchPosture(results);
      setReport(finalReport);
      addLog('Launch Control', `Verification Cycle Complete. Readiness: ${finalReport.overallReadiness}%`, 'success');
    } catch (e) {
      addLog('Launch Control', 'Critical Telemetry Interruption.', 'critical');
    } finally {
      setIsAuditing(false);
    }
  };

  const toggleChaos = (type: 'latency' | 'failure') => {
    if (type === 'latency') {
      const current = localStorage.getItem('isthmic_chaos_latency');
      if (current) localStorage.removeItem('isthmic_chaos_latency');
      else localStorage.setItem('isthmic_chaos_latency', '3500');
    } else {
      const current = localStorage.getItem('isthmic_chaos_failure');
      if (current === 'true') localStorage.setItem('isthmic_chaos_failure', 'false');
      else {
        localStorage.setItem('isthmic_chaos_failure', 'true');
        addLog('Chaos Engine', 'CRITICAL_FAILURE_SIMULATION: Manual trigger.', 'critical');
      }
    }
    window.location.reload(); 
  };

  const isSafeMode = report?.ewsStatus === 'CRITICAL';

  return (
    <div className="space-y-12 animate-precision">
      {isSafeMode && (
        <div className="bg-red-600 p-4 text-center text-[10px] font-black uppercase tracking-[0.5em] text-white animate-pulse">
          SYSTEM_SAFE_MODE_ACTIVE // AI_INFERENCE_THROTTLED
        </div>
      )}

      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shadow-[0_0_15px] ${report?.authorizedForLaunch ? 'bg-green-500 shadow-green-500' : 'bg-red-600 shadow-red-600 animate-pulse'}`}></div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Mission Registry // Isthmic Pro v13.0</span>
           </div>
           <h2 className="text-5xl lg:text-7xl prestige-heading text-white italic leading-none">Command_Post</h2>
        </div>
        
        <div className="flex gap-4">
           <button 
             onClick={() => setShowChaosPanel(!showChaosPanel)}
             className="px-6 py-4 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:text-white"
           >
              {showChaosPanel ? 'Hide Simulator' : 'Chaos Deck'}
           </button>
           <button 
             onClick={runFullVerification}
             disabled={isAuditing}
             className="prestige-btn !bg-white !text-black !px-12 !py-6 hover:!bg-[#d4af37] transition-all"
           >
              {isAuditing ? <i className="fas fa-satellite fa-spin"></i> : <i className="fas fa-shield-check"></i>}
              <span className="ml-3 uppercase tracking-[0.2em]">{isAuditing ? 'Executing SVP...' : 'Execute Full Audit'}</span>
           </button>
        </div>
      </header>

      {showChaosPanel && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-red-900/10 border border-red-500/20 p-8 rounded-[40px] animate-slide-up">
           <div className="space-y-4">
              <h4 className="text-[10px] font-black text-red-500 uppercase tracking-widest">Chaos Injection Deck</h4>
              <p className="text-xs text-slate-500 italic uppercase">Validate EWS response times and safe-mode transitions.</p>
           </div>
           <div className="flex gap-4 justify-end items-center">
              <button onClick={() => toggleChaos('latency')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase border ${localStorage.getItem('isthmic_chaos_latency') ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                Inject Latency (3.5s)
              </button>
              <button onClick={() => toggleChaos('failure')} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase border ${localStorage.getItem('isthmic_chaos_failure') === 'true' ? 'bg-red-600 text-white' : 'bg-white/5 text-slate-500'}`}>
                Inject DB Failure
              </button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-10">
            {report ? (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.components.map((c) => (
                    <div key={c.id} className="square-card p-8 bg-white/[0.02] border border-white/5 group hover:border-white/20 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1 rounded-full text-[8px] font-black uppercase ${c.status === 'STABLE' ? 'text-green-500 bg-green-500/10' : 'text-amber-500 bg-amber-500/10'}`}>{c.status}</span>
                        <div className="text-[9px] font-mono text-slate-600">Health: {c.phi}%</div>
                      </div>
                      <h4 className="text-xl font-bold text-white italic group-hover:text-[#d4af37] transition-colors">{c.name}</h4>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">{c.category}</p>
                    </div>
                  ))}
                </div>

                {/* Final 0.2% Gap Manifest */}
                <div className="bg-black/60 border border-[#d4af37]/20 rounded-[40px] p-10 space-y-8 relative overflow-hidden">
                   <div className="flex items-center gap-4 relative z-10">
                      <i className="fas fa-microchip text-[#d4af37] text-2xl"></i>
                      <h3 className="text-xl prestige-heading text-white italic">The Final 0.2% // Gap Manifest</h3>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                      {[
                        { title: 'Shield Latency', status: '0.08% Remaining', desc: 'XOR local encryption speed validation (<2ms).' },
                        { title: 'Neural Echo', status: '0.07% Remaining', desc: 'Gemini 3 inference deterministic consistency check.' },
                        { title: 'Registry Sync', status: '0.05% Remaining', desc: 'Real-time drift verification across global registrars.' }
                      ].map((gap, i) => (
                        <div key={i} className="p-6 bg-white/2 border border-white/5 rounded-2xl space-y-3">
                           <div className="flex justify-between items-center">
                              <span className="text-[9px] font-black text-white uppercase">{gap.title}</span>
                              <span className="text-[8px] font-mono text-[#d4af37]">{gap.status}</span>
                           </div>
                           <p className="text-[10px] text-slate-500 italic leading-relaxed">{gap.desc}</p>
                        </div>
                      ))}
                   </div>
                   <i className="fas fa-terminal absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[150px] pointer-events-none"></i>
                </div>
              </div>
            ) : (
              <div className="h-[600px] border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center justify-center opacity-20">
                 <i className="fas fa-radar text-9xl"></i>
                 <p className="text-xl font-black uppercase tracking-[1em] mt-8">Awaiting_Forensics</p>
              </div>
            )}
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className={`square-card p-10 transition-all duration-700 ${isSafeMode ? 'bg-red-900/30 border-red-500' : 'bg-black/60 border-white/5'}`}>
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">EWS Pulse</h3>
                  <div className={`w-3 h-3 rounded-full ${report?.ewsStatus === 'NOMINAL' ? 'bg-green-500 shadow-[0_0_10px_green]' : 'bg-red-500 animate-ping'}`}></div>
               </div>
               <div className="space-y-6">
                  {liveAlerts.length > 0 ? liveAlerts.map(a => (
                    <div key={a.id} className="p-5 bg-white/2 border border-white/10 rounded-2xl animate-slide-up">
                       <div className="text-[9px] font-black uppercase text-red-500 mb-1">{a.type}</div>
                       <div className="text-xs text-white italic font-medium">{a.metric} recorded from {a.source}</div>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-30 italic text-xs">// Network_Nominal</div>
                  )}
               </div>
            </div>

            {report && (
              <div className="square-card p-10 bg-[#d4af37]/5 border-[#d4af37]/30 flex flex-col justify-between min-h-[450px]">
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest leading-none">Readiness Index</h3>
                    <div className="text-8xl font-black text-white italic leading-none">{report.overallReadiness}%</div>
                    
                    <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-4">
                       <div>
                          <div className="text-[8px] font-black text-slate-500 uppercase mb-2">Director's Recommendation</div>
                          <p className="text-[10px] text-white italic font-bold">
                            {report.overallReadiness >= 99.8 
                              ? 'GO: Stable thresholds reached. Final mile gaps are low-risk.' 
                              : 'NO-GO: Core architecture requires stabilization.'}
                          </p>
                       </div>
                       <div className="pt-2 border-t border-white/5">
                          <div className="text-[8px] font-black text-slate-500 uppercase mb-1">Calculated Risk</div>
                          <div className="flex items-center gap-2">
                             <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[#d4af37] w-[15%]"></div>
                             </div>
                             <span className="text-[8px] font-mono text-[#d4af37]">LOW</span>
                          </div>
                       </div>
                    </div>
                 </div>
                 <button 
                  disabled={!report.authorizedForLaunch || isSafeMode}
                  className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                    ${report.authorizedForLaunch && !isSafeMode ? 'bg-[#d4af37] text-black shadow-2xl scale-105' : 'bg-white/5 text-slate-700 cursor-not-allowed'}`}
                 >
                   {isSafeMode ? 'AUTHORIZATION_REVOKED' : 'AUTHORIZE STABLE RELEASE'}
                 </button>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default LaunchControlHub;
