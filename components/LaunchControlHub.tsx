
import React, { useState, useEffect } from 'react';
import { LaunchReadinessReport, SovereignAutopsyReport, EWSAlert, PerformanceTelemetry } from '../types';
import { LaunchReadinessService } from '../services/LaunchReadinessService';
import { AutopsyService } from '../services/ai/AutopsyService';
import { useDomainContext } from '../context/DomainContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LaunchControlHub: React.FC = () => {
  const { addLog, activityLogs, activeProfile, stats } = useDomainContext();
  const [report, setReport] = useState<LaunchReadinessReport | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<EWSAlert[]>([]);
  const [isProductionLocked, setIsProductionLocked] = useState(localStorage.getItem('isthmic_production_active') === 'true');

  const isRootAdmin = activeProfile?.email.toLowerCase() === 'azeddinebeldjilali9@gmail.com';
  const isFailureInjected = localStorage.getItem('isthmic_chaos_failure') === 'true';

  useEffect(() => {
    if (!isRootAdmin) return;
    const { status, alerts } = LaunchReadinessService.monitorTelemetry(activityLogs);
    setLiveAlerts(alerts);
    if (report && report.ewsStatus !== status) {
      setReport({ ...report, ewsStatus: status });
    }
  }, [activityLogs, isRootAdmin]);

  const runFullVerification = async () => {
    setIsAuditing(true);
    addLog('Launch Control', 'Initiating Final Verification Protocol (FVP)...', 'info');
    
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
      }

      const finalReport = await LaunchReadinessService.evaluateLaunchPosture(results);
      setReport(finalReport);
      addLog('Launch Control', `Audit Complete. Readiness: ${finalReport.overallReadiness}%`, 'success');
    } catch (e) {
      addLog('Launch Control', 'Critical Telemetry Interruption.', 'critical');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleAuthorizeDeployment = async () => {
    if (!report?.authorizedForLaunch || isFailureInjected) return;
    
    setIsDeploying(true);
    addLog('DEPLOYMENT', 'Starting Sovereign Deployment Sequence...', 'info');

    try {
      localStorage.setItem('isthmic_production_active', 'true');
      setIsProductionLocked(true);
      addLog('DEPLOYMENT', 'ISTHMIC PRO V13.0.1 IS NOW LIVE.', 'success');
      setTimeout(() => window.location.reload(), 2000);
    } catch (e) {
      addLog('DEPLOYMENT', 'DEPLOYMENT_HALTED: Sequence failure detected.', 'critical');
    } finally {
      setIsDeploying(false);
    }
  };

  const latencyData = stats.telemetry?.apiLatencyHistory.map((l, i) => ({ time: i, ms: l })) || [];

  const rec = (isFailureInjected || (report && report.overallReadiness < 80)) 
    ? { label: 'NO-GO', color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Infrastructure failure or low health detected.' }
    : (report && report.overallReadiness >= 90)
    ? { label: 'GO', color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Stable thresholds reached. Platform ready.' }
    : { label: 'CONDITIONAL', color: 'text-amber-500', bg: 'bg-amber-500/10', desc: 'Ready with day-1 remediation requirements.' };

  return (
    <div className="space-y-12 animate-precision">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 border-b border-white/10 pb-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shadow-[0_0_15px] ${isProductionLocked ? 'bg-indigo-500' : (rec.label === 'GO' ? 'bg-green-500' : 'bg-red-600 animate-pulse')}`}></div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">
                {isProductionLocked ? 'PRODUCTION_LOCKED // ACTIVE' : 'Sovereign Launch Registry // v13.2'}
              </span>
           </div>
           <h2 className="text-5xl lg:text-7xl prestige-heading text-white italic leading-none">
             {isProductionLocked ? 'Unit_Deployed' : 'Execution_Posture'}
           </h2>
        </div>
        
        <div className="flex gap-4">
           {!isProductionLocked && (
             <button onClick={runFullVerification} disabled={isAuditing} className="prestige-btn !bg-white !text-black !px-12 !py-6">
                {isAuditing ? <i className="fas fa-satellite fa-spin"></i> : <i className="fas fa-shield-check"></i>}
                <span className="ml-3 uppercase tracking-[0.2em]">Verify Posture</span>
             </button>
           )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="square-card p-6 bg-white/[0.02] border border-white/5 h-40 flex flex-col justify-between">
                  <div className="text-[9px] font-black text-slate-500 uppercase">Avg API Latency</div>
                  <div className="text-4xl font-black text-white italic">{stats.telemetry?.avgLatency || '--'}ms</div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                     <div className={`h-full ${stats.telemetry?.avgLatency && stats.telemetry.avgLatency > 2000 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: '100%' }}></div>
                  </div>
               </div>
               <div className="square-card p-6 bg-white/[0.02] border border-white/5 h-40 flex flex-col justify-between">
                  <div className="text-[9px] font-black text-slate-500 uppercase">Success Rate</div>
                  <div className="text-4xl font-black text-white italic">{stats.telemetry?.inferenceSuccessRate || '--'}%</div>
                  <div className="text-[8px] font-black text-green-500">TARGET: > 95%</div>
               </div>
               <div className="square-card p-6 bg-white/[0.02] border border-white/5 h-40 flex flex-col justify-between">
                  <div className="text-[9px] font-black text-slate-500 uppercase">System Integrity</div>
                  <div className="text-4xl font-black text-[#d4af37] italic">{report ? report.overallReadiness : '--'}%</div>
                  <div className="text-[8px] font-black text-slate-600">PHI: CALIBRATED</div>
               </div>
            </div>

            {/* Latency Graph Section */}
            <div className="square-card p-10 bg-black/40 border border-white/5 h-[300px] flex flex-col">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Real-time Pulse Latency (API Cycles)</h3>
               <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={latencyData}>
                        <defs>
                           <linearGradient id="colorMs" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                        <XAxis hide />
                        <YAxis hide domain={[0, 4000]} />
                        <Tooltip contentStyle={{ background: '#0a0a0c', border: 'none', borderRadius: '12px' }} />
                        <Area type="monotone" dataKey="ms" stroke="#d4af37" fillOpacity={1} fill="url(#colorMs)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {report && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                 {report.components.map(c => (
                   <div key={c.id} className="p-4 bg-white/2 border border-white/5 rounded-2xl">
                      <div className="text-[8px] font-black text-slate-600 uppercase mb-2">{c.name}</div>
                      <div className={`text-sm font-bold ${c.status === 'STABLE' ? 'text-green-500' : 'text-amber-500'}`}>{c.status}</div>
                   </div>
                 ))}
              </div>
            )}
         </div>

         <div className="lg:col-span-4 space-y-8">
            <div className={`square-card p-10 flex flex-col justify-between min-h-[500px] ${rec.bg} border-2 ${rec.color.replace('text-', 'border-').replace('500', '500/20')}`}>
               <div className="space-y-8">
                  <div className="space-y-2">
                     <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status Alpha</h3>
                     <div className={`text-5xl font-black italic ${rec.color}`}>{isProductionLocked ? 'LOCKED' : rec.label}</div>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed italic">"{rec.desc}"</p>
                  
                  {liveAlerts.length > 0 && (
                    <div className="space-y-3">
                       <h4 className="text-[9px] font-black text-red-500 uppercase">EWS Critical Warnings ({liveAlerts.length})</h4>
                       {liveAlerts.slice(0, 2).map(a => (
                         <div key={a.id} className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl text-[10px] text-red-100 italic">
                            [{a.type}] {a.metric} detected in {a.source}.
                         </div>
                       ))}
                    </div>
                  )}
               </div>

               <button 
                onClick={handleAuthorizeDeployment}
                disabled={!report?.authorizedForLaunch || isFailureInjected || isProductionLocked}
                className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${rec.label === 'GO' && !isFailureInjected && !isProductionLocked ? 'bg-white text-black shadow-2xl scale-105' : 'bg-white/5 text-slate-700'}`}
               >
                 {isProductionLocked ? 'STATION_LOCKED' : 'Authorize Deploy'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default LaunchControlHub;
