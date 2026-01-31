import React, { useState, useEffect } from 'react';
import { 
  SovereignAutopsyReport, 
  AutomaticFix, 
  ProjectExecutiveSummary, 
  FixImpactReport, 
  ProblemCatalog 
} from '../types';
import { AutopsyService } from '../services/ai/AutopsyService';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Tooltip as ChartTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell
} from 'recharts';

const AutopsyLab: React.FC = () => {
  const [reports, setReports] = useState<SovereignAutopsyReport[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [activeReportId, setActiveReportId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'matrix' | 'dissection' | 'surgery' | 'executive' | 'catalog'>('matrix');
  const [executiveSummary, setExecutiveSummary] = useState<ProjectExecutiveSummary | null>(null);
  const [catalog, setCatalog] = useState<ProblemCatalog | null>(null);
  const [validatingFixId, setValidatingFixId] = useState<string | null>(null);

  const currentReport = reports.find(r => r.id === activeReportId) || reports[0];

  const runBatchAutopsy = async () => {
    setIsAuditing(true);
    const filesToDissect = [
      { name: 'base.ts', path: './services/ai/base.ts' },
      { name: 'NegotiationDashboard.tsx', path: './components/NegotiationDashboard.tsx' },
      { name: 'DiscoveryService.ts', path: './services/ai/DiscoveryService.ts' },
      { name: 'NegotiationService.ts', path: './services/ai/NegotiationService.ts' },
      { name: 'App.tsx', path: './App.tsx' }
    ];

    try {
      const results: SovereignAutopsyReport[] = [];
      for (const file of filesToDissect) {
        try {
          const response = await fetch(file.path);
          if (!response.ok) continue;
          const code = await response.text();
          const report = await AutopsyService.performAutopsy(file.name, file.path, code);
          results.push(report);
        } catch (e) {
          console.error(`Failed to dissect ${file.name}`, e);
        }
      }
      setReports(results);
      if (results.length > 0) setActiveReportId(results[0].id);
      
      const [summary, problemCatalog] = await Promise.all([
        AutopsyService.synthesizeExecutiveSummary(results),
        AutopsyService.synthesizeProblemCatalog(results)
      ]);
      setExecutiveSummary(summary);
      setCatalog(problemCatalog);
    } catch (e) {
      console.error("Batch Autopsy Failed", e);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleApplyFix = async (fix: AutomaticFix) => {
    if (!currentReport) return;
    setValidatingFixId(fix.id);
    try {
      const response = await fetch(currentReport.specimen.filePath);
      const originalCode = await response.text();
      const impact = await AutopsyService.validateRemediation(currentReport, fix, originalCode);
      
      setReports(prev => prev.map(r => r.id === currentReport.id ? { ...r, impactReport: impact } : r));
    } catch (e) {
      console.error("Validation failed", e);
    } finally {
      setValidatingFixId(null);
    }
  };

  const radarData = currentReport ? [
    { subject: 'Architecture', A: currentReport.metrics.architecturalScore, fullMark: 100 },
    { subject: 'Quality', A: currentReport.metrics.codeQualityScore, fullMark: 100 },
    { subject: 'Performance', A: currentReport.metrics.performanceScore, fullMark: 100 },
    { subject: 'Security', A: currentReport.metrics.securityScore, fullMark: 100 },
    { subject: 'Testing', A: currentReport.metrics.testabilityScore, fullMark: 100 },
    { subject: 'Maint.', A: currentReport.metrics.maintainabilityScore, fullMark: 100 },
  ] : [];

  const COLORS = ['#d4af37', '#818cf8', '#f43f5e', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-10 animate-precision">
      <header className="flex justify-between items-center border-b border-white/10 pb-10">
        <div className="space-y-2">
           <h2 className="text-5xl prestige-heading text-white italic leading-none">Sovereign Autopsy Lab</h2>
           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em]">Institutional Mastery & Predictive Remediation // v1.8</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('executive')}
            className="px-8 py-5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all"
          >
            Institutional Health
          </button>
          <button 
            onClick={runBatchAutopsy}
            disabled={isAuditing}
            className="prestige-btn prestige-btn-gold !px-12 !py-5"
          >
            {isAuditing ? <i className="fas fa-microscope fa-spin"></i> : <i className="fas fa-dna"></i>}
            <span className="ml-3 uppercase tracking-widest">{isAuditing ? 'Executing Batch Dissection...' : 'Comprehensive Audit'}</span>
          </button>
        </div>
      </header>

      {reports.length === 0 ? (
        <div className="h-[500px] border-2 border-dashed border-white/5 rounded-[50px] flex flex-col items-center justify-center space-y-8 opacity-20">
           <i className="fas fa-vials text-9xl"></i>
           <p className="text-sm font-black uppercase tracking-[1em]">Establishing_Institutional_Baseline</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Dashboard Tabs */}
          <div className="flex bg-white/5 p-2 rounded-3xl w-fit gap-2 overflow-x-auto no-scrollbar max-w-full">
             {[
               { id: 'matrix', label: 'Specimen Matrix' },
               { id: 'dissection', label: 'Neural Dissection' },
               { id: 'catalog', label: 'Problem Catalog' },
               { id: 'surgery', label: 'Remediation' },
               { id: 'executive', label: 'Strategic Briefing' }
             ].map(t => (
               <button 
                 key={t.id}
                 onClick={() => setActiveTab(t.id as any)}
                 className={`px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap
                   ${activeTab === t.id ? 'bg-[#d4af37] text-black shadow-xl' : 'text-slate-500 hover:text-white'}`}
               >
                 {t.label}
               </button>
             ))}
          </div>

          {activeTab === 'executive' && executiveSummary && (
            <div className="animate-slide-up grid grid-cols-12 gap-10">
               <div className="col-span-4 space-y-8">
                  <div className="square-card p-10 bg-indigo-500/10 border-indigo-500/20 text-center relative overflow-hidden">
                     <h3 className="text-[10px] font-black text-indigo-400 uppercase mb-4 tracking-widest relative z-10">Institutional PHI</h3>
                     <div className="text-8xl font-black text-white italic relative z-10">{executiveSummary.projectHealthScore}%</div>
                     <i className="fas fa-microchip absolute right-[-20px] top-[-20px] text-white/[0.03] text-[150px] pointer-events-none"></i>
                  </div>
                  <div className="square-card p-10 bg-[#d4af37]/10 border-[#d4af37]/20 text-center relative overflow-hidden">
                     <h3 className="text-[10px] font-black text-[#d4af37] uppercase mb-4 tracking-widest relative z-10">FAANG Readiness Index</h3>
                     <div className="text-8xl font-black text-white italic relative z-10">{executiveSummary.faangReadinessIndex}%</div>
                     <i className="fas fa-award absolute right-[-20px] top-[-20px] text-white/[0.03] text-[150px] pointer-events-none"></i>
                  </div>
                  <div className="square-card p-8 bg-black/40 border border-white/5 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Aggregate Tech Debt</span>
                        <span className="text-2xl font-black text-red-500">{executiveSummary.totalDebtHours}h</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Momentum Trend</span>
                        <span className={`text-sm font-black ${executiveSummary.debtTrend === 'DOWN' ? 'text-green-500' : 'text-red-500'}`}>
                           {executiveSummary.debtTrend} {executiveSummary.debtTrend === 'DOWN' ? '▼' : '▲'}
                        </span>
                     </div>
                  </div>
               </div>
               <div className="col-span-8 bg-[#050505] border border-white/5 rounded-[50px] p-12 space-y-12 relative overflow-hidden flex flex-col justify-center">
                  <div className="space-y-6 relative z-10">
                    <h3 className="text-4xl prestige-heading text-white italic">Institutional Risk Assessment</h3>
                    <p className="text-2xl text-slate-400 leading-relaxed font-medium italic border-l-4 border-[#d4af37] pl-10">
                       "{executiveSummary.strategicRisk}"
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-10 relative z-10 pt-10 border-t border-white/5">
                     <div className="space-y-4">
                        <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Architectural Gains</span>
                        <div className="space-y-2">
                           {executiveSummary.improvedFiles.map(f => (
                             <div key={f} className="text-sm text-white font-mono opacity-80 flex items-center gap-3">
                                <i className="fas fa-shield-check text-green-500"></i> {f}
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-4">
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Stability Regressions</span>
                        <div className="space-y-2">
                           {executiveSummary.degradedFiles.map(f => (
                             <div key={f} className="text-sm text-white font-mono opacity-80 flex items-center gap-3">
                                <i className="fas fa-skull-crossbones text-red-500"></i> {f}
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <i className="fas fa-university absolute right-[-50px] bottom-[-50px] text-white/[0.01] text-[400px] pointer-events-none rotate-12"></i>
               </div>
            </div>
          )}

          {activeTab === 'catalog' && catalog && (
            <div className="animate-slide-up space-y-10">
              <div className="grid grid-cols-12 gap-10">
                <div className="col-span-8 space-y-8">
                  <h3 className="text-3xl prestige-heading text-white italic">Institutional Problem Catalog</h3>
                  <div className="space-y-4">
                    {catalog.patterns.map((p, i) => (
                      <div key={i} className="square-card p-8 bg-white/[0.02] border border-white/5 flex gap-8 items-center hover:border-[#d4af37]/30 transition-all group">
                        <div className="text-center min-w-[80px]">
                           <div className="text-3xl font-black text-white italic">{Math.round(p.frequency * 100)}%</div>
                           <div className="text-[8px] font-black text-slate-600 uppercase">Frequency</div>
                        </div>
                        <div className="flex-1 space-y-2">
                           <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-white italic group-hover:text-[#d4af37] transition-colors">{p.name}</h4>
                              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase ${p.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-slate-500'}`}>{p.severity}</span>
                           </div>
                           <p className="text-xs text-slate-400 font-medium italic">"{p.description}"</p>
                           <p className="text-[10px] text-[#d4af37] font-black uppercase mt-2">Recommended: {p.globalRecommendation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-span-4 space-y-8">
                  <div className="square-card p-10 bg-[#050505] border border-white/10">
                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-10">Institutional Health Matrix</h4>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={catalog.patterns}>
                          <XAxis hide />
                          <YAxis hide />
                          <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
                            {catalog.patterns.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'matrix' && (
            <div className="animate-slide-up space-y-8">
              <div className="square-card bg-[#050505] border border-white/10 overflow-hidden shadow-2xl">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="bg-white/5 text-slate-500 uppercase tracking-widest">
                      <th className="p-6 border-r border-white/5">Specimen</th>
                      <th className="p-6 border-r border-white/5">Predictive Decay</th>
                      <th className="p-6 border-r border-white/5 text-center">AGCI %</th>
                      <th className="p-6 border-r border-white/5 text-center">Debt (h)</th>
                      <th className="p-6 border-r border-white/5 text-center">Health</th>
                      <th className="p-6 text-center">Protocol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {reports.map(r => (
                      <tr key={r.id} className={`hover:bg-white/[0.02] transition-colors ${activeReportId === r.id ? 'bg-[#d4af37]/5' : ''}`}>
                        <td className="p-6 border-r border-white/5">
                           <div className="font-black text-white italic text-sm">{r.specimen.name}</div>
                           <div className="text-[8px] text-slate-600 mt-1 uppercase truncate max-w-[120px]">{r.specimen.filePath}</div>
                        </td>
                        <td className="p-6 border-r border-white/5">
                           <div className="flex items-center gap-3">
                              <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                 <div className={`h-full ${r.predictiveDebt && r.predictiveDebt.decayProbability > 50 ? 'bg-red-500' : 'bg-[#d4af37]'}`} style={{ width: `${r.predictiveDebt?.decayProbability || 0}%` }}></div>
                              </div>
                              <span className="text-[10px] font-black text-slate-500">{r.predictiveDebt?.forecastedDebt30d || 0}h Forecast</span>
                           </div>
                        </td>
                        <td className="p-6 border-r border-white/5 text-center">
                           <span className={`px-4 py-1 rounded-full text-[9px] font-black ${r.metrics.aiGeneratedCodeIndex > 70 ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>
                             {r.metrics.aiGeneratedCodeIndex}%
                           </span>
                        </td>
                        <td className="p-6 border-r border-white/5 text-center text-red-400 font-bold">{r.technicalDebt.debtHours}h</td>
                        <td className="p-6 border-r border-white/5 text-center">
                           <div className="text-white font-black text-base italic">{r.metrics.overallHealthIndex}%</div>
                        </td>
                        <td className="p-6 text-center">
                           <button 
                            onClick={() => { setActiveReportId(r.id); setActiveTab('dissection'); }}
                            className="prestige-btn prestige-btn-gold !py-2 !px-4 !text-[8px]"
                           >
                             DISSECT SPECIMEN
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'dissection' && currentReport && (
            <div className="grid grid-cols-12 gap-10 animate-slide-up">
               <div className="col-span-5 space-y-8">
                  <div className="square-card p-10 bg-black/40">
                    <h3 className="text-[11px] font-black text-slate-500 uppercase mb-10 border-b border-white/5 pb-4">Forensic Health Radar: {currentReport.specimen.name}</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                          <PolarGrid stroke="#ffffff10" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} axisLine={false} tick={false} />
                          <Radar name="Health" dataKey="A" stroke="#d4af37" fill="#d4af37" fillOpacity={0.3} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  {currentReport.impactReport && (
                    <div className="square-card p-8 bg-green-500/5 border border-green-500/20 animate-slide-up">
                       <h4 className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                          <i className="fas fa-check-circle"></i> Clinical Remediation Success
                       </h4>
                       <div className="grid grid-cols-2 gap-6 text-center">
                          <div className="p-4 bg-white/2 rounded-2xl">
                             <div className="text-[8px] text-slate-500 uppercase">Health Yield</div>
                             <div className="text-2xl font-black text-green-500">+{currentReport.impactReport.improvementPercentage}%</div>
                          </div>
                          <div className="p-4 bg-white/2 rounded-2xl">
                             <div className="text-[8px] text-slate-500 uppercase">Latency Shift</div>
                             <div className="text-2xl font-black text-green-500">{currentReport.impactReport.performanceGain}ms</div>
                          </div>
                       </div>
                    </div>
                  )}

                  <div className="square-card p-8 bg-red-500/5 border border-red-500/10">
                     <h4 className="text-[10px] font-black text-red-400 uppercase mb-4 tracking-widest">30-Day Predictive Debt</h4>
                     <div className="text-4xl font-black text-white italic">+{currentReport.predictiveDebt?.forecastedDebt30d || 0}h</div>
                     <p className="text-[10px] text-slate-500 mt-2 uppercase">Forecasted accumulation based on pattern density</p>
                  </div>
               </div>
               <div className="col-span-7 overflow-y-auto max-h-[700px] space-y-6 custom-scrollbar pr-4">
                  {currentReport.findings.map((f, i) => (
                    <div key={i} className={`p-8 border rounded-3xl bg-white/[0.02] flex gap-6 items-start ${f.severity === 'CRITICAL' ? 'border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]' : 'border-white/5'}`}>
                      <div className={`w-3 h-3 rounded-full mt-1.5 ${f.severity === 'CRITICAL' ? 'bg-red-500 animate-pulse' : 'bg-[#d4af37]'}`}></div>
                      <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-[10px] font-black text-slate-500 uppercase">{f.category} // {f.origin}</span>
                           <span className={`text-[8px] font-black uppercase px-3 py-1 rounded-full ${f.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : 'bg-white/10 text-slate-500'}`}>{f.severity}</span>
                        </div>
                        <p className="text-sm text-white font-bold italic leading-relaxed">"{f.description}"</p>
                        <p className="text-xs text-slate-500 border-l-2 border-white/5 pl-4">{f.recommendation}</p>
                        <div className="mt-4 p-4 bg-black/40 rounded-xl border border-white/5 font-mono text-[9px] text-indigo-300">
                           <span className="text-slate-600 block mb-2">// FIX_EXAMPLE</span>
                           {f.fixExample}
                        </div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'surgery' && currentReport && (
            <div className="animate-slide-up space-y-10">
               <div className="bg-red-500/10 border border-red-500/20 p-10 rounded-[50px]">
                  <div className="flex items-center gap-6 mb-10">
                    <div className="w-16 h-16 bg-red-500/20 rounded-3xl flex items-center justify-center text-red-500 text-3xl shadow-2xl"><i className="fas fa-scalpel-path"></i></div>
                    <div>
                       <h3 className="text-3xl prestige-heading text-white italic">Surgical Optimization Hub</h3>
                       <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">Validating patches against machine repetition hallmarks</p>
                    </div>
                  </div>

                  <div className="space-y-8">
                     {currentReport.automaticFixes.map((fix) => (
                       <div key={fix.id} className="square-card bg-black/60 p-10 border border-white/5 space-y-8 relative overflow-hidden">
                          <div className="flex justify-between items-center relative z-10">
                             <div className="space-y-1">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol ID: {fix.id.slice(0, 8)}</span>
                                <h4 className="text-xl font-bold text-white italic">{fix.description}</h4>
                             </div>
                             <div className="text-right">
                                <span className="text-green-500 text-2xl font-black italic">{fix.confidence}% Confidence</span>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-10 mt-6 relative z-10">
                             <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase text-red-500/60">Current Specimen Sequence</span>
                                <pre className="bg-red-900/10 p-8 rounded-2xl text-[11px] text-red-200 border border-red-900/20 overflow-x-auto font-mono">
                                   <code>{fix.before}</code>
                                </pre>
                             </div>
                             <div className="space-y-4">
                                <span className="text-[9px] font-black uppercase text-green-500/60">Remediated Target Sequence</span>
                                <pre className="bg-green-900/10 p-8 rounded-2xl text-[11px] text-green-200 border border-green-900/20 overflow-x-auto font-mono">
                                   <code>{fix.after}</code>
                                </pre>
                             </div>
                          </div>

                          <div className="pt-6 border-t border-white/5 relative z-10">
                             <button 
                               onClick={() => handleApplyFix(fix)}
                               disabled={validatingFixId !== null}
                               className="prestige-btn !bg-white !text-black !px-16 !py-4 hover:!bg-[#d4af37] transition-all shadow-2xl flex items-center justify-center gap-4"
                             >
                                {validatingFixId === fix.id ? (
                                   <><i className="fas fa-sync fa-spin"></i> Validating Surgical Impact...</>
                                ) : (
                                   <><i className="fas fa-clipboard-check"></i> Apply Remediation Patch</>
                                )}
                             </button>
                          </div>
                          <i className="fas fa-dna absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[150px] pointer-events-none -rotate-12"></i>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AutopsyLab;