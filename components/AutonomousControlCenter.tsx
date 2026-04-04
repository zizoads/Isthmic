
import React, { useState, useEffect, useRef } from 'react';
import { AgentThought, PlatformStrategy, DecompositionPlan, Domain } from '../types';
import { MasterBrainEngine } from '../services/masterBrainEngine';
import { useDomainContext } from '../context/DomainContext';

interface Props {
  strategy: PlatformStrategy;
  onDomainsInjected: (domains: Domain[]) => void;
}

const AutonomousControlCenter: React.FC<Props> = ({ strategy, onDomainsInjected }) => {
  const { addLog, setIsBrainActive } = useDomainContext();
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activePlan, setActivePlan] = useState<DecompositionPlan | null>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  const runSystem = async () => {
    if (!strategy.investmentThesis) {
       addLog('Master Brain', 'Thesis required for decomposition.', 'warning');
       return;
    }
    setIsRunning(true);
    setThoughts([]);
    setActivePlan(null);
    
    const engine = new MasterBrainEngine(
      (updated) => setThoughts(updated),
      undefined,
      (val) => setIsBrainActive(val)
    );
    
    try {
      const results = await engine.executePlan(strategy, (plan) => setActivePlan(plan));
      onDomainsInjected(results);
      addLog('Master Brain', 'Plan executed flawlessly.', 'success');
    } catch (e: any) {
      addLog('System', `Loop interrupted: ${e.message}`, 'critical');
    } finally {
      setIsRunning(false);
      setIsBrainActive(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 border-b border-white/5 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-[#d4af37] pulse-gold rounded-full"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Autonomous Strategic Unit</span>
          </div>
          <h2 className="text-5xl lg:text-7xl prestige-title text-white italic leading-none">The Machine Loop.</h2>
        </div>
        
        <button 
          onClick={runSystem}
          disabled={isRunning}
          className="px-12 py-5 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d4af37] transition-all shadow-2xl flex items-center gap-4"
        >
          {isRunning ? <><i className="fas fa-dna fa-spin"></i> EXECUTING_NODES</> : <><i className="fas fa-bolt"></i> START_DECOMPOSITION</>}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-0 border border-white/5 glass-panel overflow-hidden h-[700px]">
        {/* Left Panel: Decomposition Map */}
        <div className="col-span-12 lg:col-span-4 bg-black/80 border-r border-white/5 p-10 flex flex-col">
           <h4 className="text-[11px] font-black text-[#d4af37] uppercase tracking-widest mb-10 border-b border-[#d4af37]/20 pb-4">Strategy_Nodes</h4>
           <div className="flex-1 space-y-6">
              {activePlan ? activePlan.nodes.map((node, i) => (
                <div key={node.id} className="relative flex items-start gap-6 group">
                   {i < activePlan.nodes.length - 1 && <div className="absolute top-8 left-4 w-[1px] h-12 bg-white/10 group-last:hidden"></div>}
                   <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all duration-700 ${node.status === 'completed' ? 'bg-green-500 border-green-500 text-black' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                      {node.status === 'completed' ? <i className="fas fa-check"></i> : i + 1}
                   </div>
                   <div className="space-y-1">
                      <div className={`text-xs font-black uppercase tracking-tighter ${node.status === 'completed' ? 'text-white' : 'text-slate-600'}`}>{node.label}</div>
                      <p className="text-[9px] text-slate-500 italic leading-tight">{node.description}</p>
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-10 grayscale">
                   <i className="fas fa-network-wired text-6xl mb-6"></i>
                   <p className="text-[8px] font-black uppercase tracking-widest">Awaiting Plan Synthesis</p>
                </div>
              )}
           </div>
        </div>

        {/* Right Panel: Output Channel */}
        <div className="col-span-12 lg:col-span-8 flex flex-col bg-[#050507]">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Intelligence Stream</span>
            <div className="flex items-center gap-4">
               <span className="text-[8px] font-mono text-green-500/50">NODE_LOCK: ACTIVE</span>
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50"></div>
               </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-12 space-y-10 font-mono custom-scrollbar bg-black/40">
            {thoughts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-10">
                <i className="fas fa-brain text-7xl mb-6 animate-pulse"></i>
                <p className="text-[10px] tracking-[0.4em] uppercase font-black">Neural_State: Quiescent</p>
              </div>
            ) : thoughts.map((thought, i) => (
              <div key={i} className={`reveal-on-scroll border-l-2 pl-8 py-1 ${thought.status === 'thinking' ? 'border-[#d4af37] animate-pulse' : 'border-white/10'}`}>
                <div className="flex justify-between items-center mb-3">
                   <span className="text-[9px] font-black uppercase tracking-widest text-[#d4af37]">{thought.role}</span>
                   <span className="text-[8px] text-slate-700">[{thought.timestamp}]</span>
                </div>
                <p className="text-lg text-white/80 leading-relaxed italic prestige-title">
                  "{thought.message}"
                </p>
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
