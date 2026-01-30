
import React, { useState, useEffect, useRef } from 'react';
import { AgentThought, PlatformStrategy, AutonomousAction, AgentRole, ActiveJob } from '../types';
import { MasterBrainEngine } from '../services/masterBrainEngine';
import { useDomainContext } from '../context/DomainContext';
import { translations } from '../translations';

interface Props {
  strategy: PlatformStrategy;
  onDomainsInjected: (domains: any[]) => void;
  lang: 'ar' | 'en';
}

const AutonomousControlCenter: React.FC<Props> = ({ strategy, onDomainsInjected, lang }) => {
  const { activeJobs, saveJob, clearJob } = useDomainContext();
  const t = translations[lang];
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-Recovery Logic
  useEffect(() => {
    const activeLoop = activeJobs.find(j => j.type === 'SOVEREIGN_LOOP' && j.status === 'running');
    if (activeLoop) {
      setThoughts(activeLoop.thoughts);
    }
  }, [activeJobs]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  const runSystem = async () => {
    setIsRunning(true);
    setThoughts([]);
    
    const jobId = `job_${Date.now()}`;
    const initialJob: ActiveJob = {
      id: jobId,
      workspaceId: strategy.id,
      type: 'SOVEREIGN_LOOP',
      status: 'running',
      payload: { strategy },
      thoughts: [],
      lastUpdate: new Date().toISOString()
    };
    
    await saveJob(initialJob);

    const engine = new MasterBrainEngine(
      async (updatedThoughts) => {
        setThoughts(updatedThoughts);
        await saveJob({ ...initialJob, thoughts: updatedThoughts });
      },
      () => {}, // No external action callback needed for internal loops
      jobId
    );
    
    try {
      const results = await engine.executeSovereignLoop(strategy);
      onDomainsInjected(results);
      await clearJob(jobId);
    } catch (e) {
      console.error(e);
      await saveJob({ ...initialJob, status: 'failed' });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-10 animate-precision">
      <div className="square-card p-1">
        <div className="bg-[#121214] rounded-[31px] p-10 lg:p-14 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-5xl prestige-heading text-white italic">
                Sovereign Logic Narrative
              </h2>
              {activeJobs.some(j => j.status === 'running') && (
                <div className="px-4 py-1.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase rounded-lg border border-indigo-500/20 animate-pulse">
                   {t.resumingSession}
                </div>
              )}
            </div>
            
            <button 
              onClick={runSystem}
              disabled={isRunning}
              className={`px-12 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all
                ${isRunning 
                ? 'bg-white/5 text-slate-700' 
                : 'bg-white text-black hover:bg-[#c5a059] hover:text-white shadow-2xl'
              }`}
            >
              {isRunning ? 'CALIBRATING' : 'ENGAGE CORE'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:h-[650px]">
        <div className="lg:col-span-8 square-card flex flex-col bg-[#161618]">
          <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-12 no-scrollbar">
            {thoughts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fas fa-feather text-4xl mb-6 text-[#c5a059]"></i>
                <p className="prestige-heading text-xl">The canvas awaits a stroke of logic.</p>
              </div>
            ) : thoughts.map((thought, i) => (
              <div key={i} className="flex gap-8 group animate-precision border-b border-white/[0.02] pb-10 last:border-0">
                <div className={`icon-box rounded-2xl flex items-center justify-center text-sm border transition-all duration-1000
                  ${thought.status === 'thinking' ? 'bg-[#c5a059]/10 border-[#c5a059]/30 text-[#c5a059]' : 'bg-white/5 border-white/10 text-slate-600'}`}>
                  <i className={`fas ${thought.role === AgentRole.STRATEGIST ? 'fa-chess-rook' : 'fa-compass'}`}></i>
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest">{thought.role}</span>
                    <span className="text-[8px] text-slate-700 data-mono">{thought.timestamp}</span>
                  </div>
                  <p className={`text-lg leading-relaxed prestige-heading italic ${thought.status === 'thinking' ? 'text-white' : 'text-slate-400'}`}>
                    {thought.message}
                  </p>
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlCenter;
