import React, { useEffect, useState } from 'react';
import { ProjectIntelligenceService, ProjectInsight, ProjectContext } from '../services/ai/ProjectIntelligenceService';
import { SignalMonitorService, IntelligenceSignal } from '../../services/SignalMonitorService';
import { Shield, Zap, Cpu, Activity, Terminal, Layers, RefreshCw, AlertTriangle, Globe, Radio, MessageSquare, Plane } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const IntelligenceHub: React.FC = () => {
  const [insights, setInsights] = useState<ProjectInsight[]>([]);
  const [context, setContext] = useState<ProjectContext | null>(null);
  const [signals, setSignals] = useState<IntelligenceSignal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'context' | 'terminal' | 'signals'>('insights');

  const service = new ProjectIntelligenceService();
  const signalService = SignalMonitorService.getInstance();

  const fetchIntelligence = async () => {
    setLoading(true);
    setError(null);
    try {
      const ctx = await service.getProjectContext();
      setContext(ctx);
      const generatedInsights = await service.generateInsights(ctx);
      setInsights(generatedInsights);
    } catch (err) {
      console.error(err);
      setError("Failed to initialize Sovereign Intelligence Hub.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntelligence();
    
    // Subscribe to real-time signals
    const unsubscribe = signalService.subscribeToSignals((newSignals) => {
      setSignals(newSignals);
    });

    return () => unsubscribe();
  }, []);

  const handleSeedSignals = async () => {
    await signalService.seedMockSignals();
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'Medium': return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
      case 'Low': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Architecture': return <Layers className="w-4 h-4" />;
      case 'Security': return <Shield className="w-4 h-4" />;
      case 'Feature': return <Zap className="w-4 h-4" />;
      case 'Refactor': return <RefreshCw className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E6E6E6] font-mono p-6 selection:bg-[#F27D26] selection:text-black">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between border-b border-[#1A1A1A] pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 rounded-full bg-[#F27D26] animate-pulse shadow-[0_0_10px_#F27D26]" />
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299]">System Status: Operational</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase italic">
            Sovereign <span className="text-[#F27D26]">Intelligence</span> Hub
          </h1>
          <p className="text-[#8E9299] mt-2 text-sm max-w-xl">
            Military-Grade Infrastructure Analysis & Project Evolution Engine. 
            Derived from Claw-Code logic for autonomous asset management.
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex gap-4">
          <button 
            onClick={fetchIntelligence}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-[#1A1A1A] hover:border-[#F27D26] hover:text-[#F27D26] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs uppercase tracking-widest">Re-Scan</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="p-4 border border-[#1A1A1A] bg-[#0A0A0A] rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] mb-4">Navigation</h3>
            <nav className="space-y-2">
              {[
                { id: 'insights', label: 'Strategic Insights', icon: <Cpu className="w-4 h-4" /> },
                { id: 'signals', label: 'Global Signals', icon: <Globe className="w-4 h-4" /> },
                { id: 'context', label: 'Project Context', icon: <Layers className="w-4 h-4" /> },
                { id: 'terminal', label: 'System Terminal', icon: <Terminal className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-widest transition-all ${
                    activeTab === tab.id 
                      ? 'bg-[#F27D26] text-black font-bold' 
                      : 'hover:bg-[#1A1A1A] text-[#8E9299]'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 border border-[#1A1A1A] bg-[#0A0A0A] rounded-sm">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[#8E9299] mb-4">Infrastructure Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#8E9299]">Core Modules</span>
                <span className="text-[10px] text-emerald-400">100%</span>
              </div>
              <div className="w-full bg-[#1A1A1A] h-1">
                <div className="bg-emerald-400 h-full w-full shadow-[0_0_5px_#34D399]" />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[#8E9299]">Security Hardening</span>
                <span className="text-[10px] text-orange-400">85%</span>
              </div>
              <div className="w-full bg-[#1A1A1A] h-1">
                <div className="bg-orange-400 h-full w-[85%] shadow-[0_0_5px_#FB923C]" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="lg:col-span-9">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-[60vh] flex flex-col items-center justify-center border border-dashed border-[#1A1A1A]"
              >
                <RefreshCw className="w-12 h-12 text-[#F27D26] animate-spin mb-4" />
                <p className="text-xs uppercase tracking-[0.3em] text-[#8E9299]">Initializing Intelligence Engine...</p>
              </motion.div>
            ) : error ? (
              <motion.div 
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[60vh] flex flex-col items-center justify-center border border-red-900/30 bg-red-900/5 text-red-400"
              >
                <AlertTriangle className="w-12 h-12 mb-4" />
                <p className="text-xs uppercase tracking-[0.2em]">{error}</p>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {activeTab === 'insights' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {insights.map((insight, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 border border-[#1A1A1A] bg-[#0A0A0A] hover:border-[#F27D26]/50 transition-all group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-2 bg-[#1A1A1A] text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-black transition-all">
                            {getCategoryIcon(insight.category)}
                          </div>
                          <span className={`text-[9px] px-2 py-1 border uppercase tracking-widest ${getImpactColor(insight.impact)}`}>
                            {insight.impact} Impact
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-2 group-hover:text-[#F27D26] transition-all">{insight.title}</h3>
                        <p className="text-xs text-[#8E9299] leading-relaxed italic">
                          {insight.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'signals' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs uppercase tracking-widest text-[#F27D26] flex items-center gap-2">
                        <Radio className="w-4 h-4 animate-pulse" /> Live Intelligence Feed (IRONSIGHT Protocol)
                      </h3>
                      <button 
                        onClick={handleSeedSignals}
                        className="text-[10px] uppercase tracking-widest text-[#8E9299] hover:text-[#F27D26] transition-all"
                      >
                        [Force Signal Ingestion]
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {signals.length === 0 ? (
                        <div className="p-12 border border-dashed border-[#1A1A1A] text-center text-[#8E9299] text-xs uppercase tracking-widest">
                          No active signals detected. Awaiting ingestion...
                        </div>
                      ) : (
                        signals.map((signal, idx) => (
                          <motion.div
                            key={signal.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`p-4 border border-[#1A1A1A] bg-[#0A0A0A] flex gap-4 items-start relative overflow-hidden ${
                              signal.priority === 'CRITICAL' ? 'border-red-500/30 bg-red-500/5' : ''
                            }`}
                          >
                            {signal.priority === 'CRITICAL' && (
                              <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_#EF4444]" />
                            )}
                            
                            <div className="p-2 bg-[#1A1A1A] text-[#F27D26]">
                              {signal.source === 'RSS' && <Globe className="w-4 h-4" />}
                              {signal.source === 'TELEGRAM' && <MessageSquare className="w-4 h-4" />}
                              {signal.source === 'API' && <Cpu className="w-4 h-4" />}
                              {signal.source === 'ADS-B' && <Plane className="w-4 h-4" />}
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-[8px] font-black uppercase tracking-widest text-[#8E9299]">
                                  {signal.source} // {signal.category} // {new Date(signal.timestamp).toLocaleTimeString()}
                                </span>
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 border ${
                                  signal.priority === 'CRITICAL' ? 'text-red-500 border-red-500/30' :
                                  signal.priority === 'HIGH' ? 'text-orange-500 border-orange-500/30' :
                                  'text-emerald-500 border-emerald-500/30'
                                }`}>
                                  {signal.priority}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold mb-1">{signal.title}</h4>
                              <p className="text-[11px] text-[#8E9299] leading-relaxed italic">{signal.content}</p>
                              
                              {signal.metadata && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {Object.entries(signal.metadata).map(([key, val]) => (
                                    <span key={key} className="text-[7px] uppercase tracking-widest px-1.5 py-0.5 bg-[#1A1A1A] text-[#F27D26] border border-[#F27D26]/20">
                                      {key}: {String(val)}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'context' && context && (
                  <div className="space-y-6">
                    <div className="p-6 border border-[#1A1A1A] bg-[#0A0A0A]">
                      <h3 className="text-xs uppercase tracking-widest text-[#F27D26] mb-4 flex items-center gap-2">
                        <Layers className="w-4 h-4" /> Project Metadata
                      </h3>
                      <pre className="text-[10px] text-[#8E9299] overflow-x-auto p-4 bg-black/50 border border-[#1A1A1A]">
                        {JSON.stringify(context.metadata, null, 2)}
                      </pre>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-[#1A1A1A] bg-[#0A0A0A]">
                        <h3 className="text-xs uppercase tracking-widest text-[#F27D26] mb-4">Refactor Status</h3>
                        <div className="text-[10px] text-[#8E9299] whitespace-pre-wrap leading-relaxed">
                          {context.refactorPlan}
                        </div>
                      </div>
                      <div className="p-6 border border-[#1A1A1A] bg-[#0A0A0A]">
                        <h3 className="text-xs uppercase tracking-widest text-[#F27D26] mb-4">Functional Inventory</h3>
                        <div className="text-[10px] text-[#8E9299] whitespace-pre-wrap leading-relaxed">
                          {context.useCases.split('\n').slice(0, 20).join('\n')}...
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'terminal' && (
                  <div className="bg-black border border-[#1A1A1A] rounded-sm overflow-hidden">
                    <div className="bg-[#1A1A1A] px-4 py-2 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-red-500/50" />
                        <div className="w-2 h-2 rounded-full bg-orange-500/50" />
                        <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                      </div>
                      <span className="text-[9px] uppercase tracking-widest text-[#8E9299]">isthmic_pro_v2.3_core_terminal</span>
                    </div>
                    <div className="p-6 h-[50vh] overflow-y-auto font-mono text-[11px] space-y-2">
                      <p className="text-emerald-400">$ isthmic-pro --scan-infrastructure</p>
                      <p className="text-[#8E9299]">[INFO] Initializing quantum-hardened data pipelines...</p>
                      <p className="text-[#8E9299]">[INFO] Scanning /architecture/ and /security/ layers...</p>
                      <p className="text-emerald-400">[SUCCESS] Infrastructure integrity verified (98.4%).</p>
                      <p className="text-orange-400">[WARN] 12 legacy components detected in /src/deprecated/.</p>
                      <p className="text-[#8E9299]">[INFO] Running Gemini 3 Flash inference for project evolution...</p>
                      <p className="text-emerald-400">$ isthmic-pro --generate-insights</p>
                      <p className="text-[#F27D26] animate-pulse">_</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-[#1A1A1A] flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span className="text-[9px] uppercase tracking-widest text-[#8E9299]">Uptime: 99.99%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-[#F27D26]" />
            <span className="text-[9px] uppercase tracking-widest text-[#8E9299]">Latency: 12ms</span>
          </div>
        </div>
        <div className="text-[9px] uppercase tracking-widest text-[#8E9299]">
          © 2026 ISTHMIC PRO SOVEREIGN | CLAW-CODE INFRASTRUCTURE
        </div>
      </footer>
    </div>
  );
};

export default IntelligenceHub;
