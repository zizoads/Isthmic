
import React, { useState, useEffect, useRef } from 'react';
import { AgentThought, PlatformStrategy, AutonomousAction, AgentRole } from '../types';
import { MasterBrainEngine } from '../services/masterBrainEngine';

interface Props {
  strategy: PlatformStrategy;
  onDomainsInjected: (domains: any[]) => void;
  lang: 'ar' | 'en';
}

const AutonomousControlCenter: React.FC<Props> = ({ strategy, onDomainsInjected, lang }) => {
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [actions, setActions] = useState<AutonomousAction[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  const runSystem = async () => {
    setIsRunning(true);
    setThoughts([]);
    const engine = new MasterBrainEngine(
      (updatedThoughts) => setThoughts(updatedThoughts),
      (newAction) => setActions(prev => [newAction, ...prev])
    );
    
    try {
      const results = await engine.executeSovereignLoop(strategy);
      onDomainsInjected(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-10 animate-precision">
      {/* Surgical Banner */}
      <div className="square-card p-1">
        <div className="bg-[#121214] rounded-[31px] p-10 lg:p-14 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-10 relative z-10">
            <div className="space-y-3">
              <h2 className="text-3xl lg:text-5xl prestige-heading text-white italic">
                Sovereign Logic Narrative
              </h2>
              <div className="flex items-center gap-4">
                 <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#c5a059] animate-pulse' : 'bg-white/10'}`}></div>
                 <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em]">
                    {isRunning ? 'Synthesizing Alpha Inference' : 'Awaiting Tactical Signal'}
                 </p>
              </div>
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
        {/* Main Terminal Area */}
        <div className="lg:col-span-8 square-card flex flex-col bg-[#161618]">
          <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Inference_Stream</span>
             <div className="text-[9px] data-mono opacity-40">Core_v7.2_Precise</div>
          </div>
          
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

        {/* Side Metrics Feed */}
        <div className="lg:col-span-4 flex flex-col gap-10 overflow-hidden">
           <div className="flex-1 square-card p-10 flex flex-col bg-white/[0.01]">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Market Impact</h3>
                <i className="fas fa-signature text-[#c5a059]/30"></i>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 no-scrollbar">
                 {actions.length === 0 ? (
                   <div className="h-full flex flex-col items-center justify-center opacity-10 scale-75">
                      <p className="text-[9px] font-black uppercase tracking-widest">Awaiting_Impact</p>
                   </div>
                 ) : actions.map((action, i) => (
                   <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-[24px] hover:bg-white/5 transition-all">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-base font-black text-white italic tracking-tighter">{action.domainName}</span>
                         <span className="text-[10px] font-black text-[#c5a059] data-mono">+{action.impactScore}%</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed italic">{action.description}</p>
                   </div>
                 ))}
              </div>
           </div>
           
           <div className="square-card p-10 bg-[#c5a059]/5 border-[#c5a059]/10">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">System Entropy</span>
              <div className="text-5xl font-light prestige-heading text-white mt-4 flex items-baseline gap-2">
                 0.92<span className="text-sm text-[#c5a059] font-mono tracking-widest">Ω</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlCenter;
