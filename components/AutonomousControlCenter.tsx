
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
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 border-b-2 border-white/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-[#c5a059]"></div>
             <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Autonomous Core</span>
          </div>
          <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic">Logic Narrative</h2>
        </div>
        
        <button 
          onClick={runSystem}
          disabled={isRunning}
          className="square-button bg-white text-black text-xs font-black"
        >
          {isRunning ? (
            <><i className="fas fa-sync fa-spin"></i> CALIBRATING_LOGIC</>
          ) : (
            <><i className="fas fa-bolt"></i> ENGAGE_CORE_PROTOCOL</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-0 border-2 border-white/10">
        {/* Terminal Section */}
        <div className="col-span-12 lg:col-span-8 h-[600px] flex flex-col bg-[#050505] border-r-2 border-white/10">
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">System_Output_Stream</span>
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-red-500"></div>
              <div className="w-2 h-2 bg-amber-500"></div>
              <div className="w-2 h-2 bg-green-500"></div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-10 font-mono custom-scrollbar">
            {thoughts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fas fa-terminal text-6xl mb-6"></i>
                <p className="text-sm tracking-[0.5em] uppercase">Awaiting_Sovereign_Engagement</p>
              </div>
            ) : thoughts.map((thought, i) => (
              <div key={i} className="flex gap-8 group animate-precision border-l-2 border-white/10 pl-8 py-2 hover:border-[#c5a059] transition-all">
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${thought.status === 'thinking' ? 'text-[#c5a059] animate-pulse' : 'text-slate-500'}`}>
                      {thought.role} // {thought.status === 'thinking' ? 'PROCESSING' : 'RESOLVED'}
                    </span>
                    <span className="text-[9px] text-slate-700 font-mono">[{thought.timestamp}]</span>
                  </div>
                  <p className="text-lg leading-relaxed prestige-heading italic text-white/90">
                    "{thought.message}"
                  </p>
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="col-span-12 lg:col-span-4 p-10 bg-white/2 space-y-10">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-[#c5a059] uppercase tracking-widest">Core Calibration</h4>
            <div className="space-y-6">
              {[
                { label: 'Neural Accuracy', val: '0.998' },
                { label: 'Market Alignment', val: '0.942' },
                { label: 'Risk Barrier', val: 'Stable' }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
                  <span className="text-xs font-mono text-white">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 border-2 border-indigo-500/20 bg-indigo-500/5">
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Pulse Status</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              The engine is monitoring real-time liquidity signals while executing the loop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlCenter;
