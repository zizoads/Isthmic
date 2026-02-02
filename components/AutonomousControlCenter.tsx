
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgentThought, PlatformStrategy, AgentRole, ActiveJob, Domain } from '../types';
import { MasterBrainEngine } from '../services/masterBrainEngine';
import { useDomainContext } from '../context/DomainContext';
import { useSovereignT } from '../hooks/useTranslation';

interface Props {
  strategy: PlatformStrategy;
  onDomainsInjected: (domains: Domain[]) => void;
  lang: 'ar' | 'en';
}

/**
 * SecureMessageRenderer: A specialized component to safely render 
 * translation-injected HTML spans (force-ltr) without using dangerouslySetInnerHTML.
 */
const SecureMessageRenderer: React.FC<{ text: string }> = ({ text }) => {
  // Safe parsing logic: Split by our known injection pattern <span class="force-ltr...
  // This prevents arbitrary HTML injection while allowing our own technical spans.
  const parts = useMemo(() => {
    const regex = /<span class="force-ltr[^>]*>(.*?)<\/span>/g;
    const result: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Add plain text before match
      if (match.index > lastIndex) {
        result.push(text.substring(lastIndex, match.index));
      }
      // Add the technical entity as a secure React component
      result.push(
        <span key={match.index} className="force-ltr data-mono inline-block font-bold text-white ltr-inline" dir="ltr">
          {match[1]}
        </span>
      );
      lastIndex = regex.lastIndex;
    }
    
    if (lastIndex < text.length) {
      result.push(text.substring(lastIndex));
    }
    
    return result;
  }, [text]);

  return <>{parts.length > 0 ? parts : text}</>;
};

const AutonomousControlCenter: React.FC<Props> = ({ strategy, onDomainsInjected, lang }) => {
  const { activeJobs, saveJob, clearJob, addLog } = useDomainContext();
  const t = useSovereignT(lang);
  const [thoughts, setThoughts] = useState<AgentThought[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [needsNewKey, setNeedsNewKey] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeLoop = activeJobs.find(j => j.type === 'SOVEREIGN_LOOP' && j.status === 'running');
    if (activeLoop) {
      setThoughts(activeLoop.thoughts);
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
  }, [activeJobs]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thoughts]);

  const handleKeyRenewal = async () => {
    if ((window as any).aistudio) {
      await (window as any).aistudio.openSelectKey();
      setNeedsNewKey(false);
      addLog('System', 'Key updated. Ready to resume protocol.', 'success');
    }
  };

  const runSystem = async (resumeId?: string) => {
    setIsRunning(true);
    setNeedsNewKey(false);
    if (!resumeId) setThoughts([]);
    
    const jobId = resumeId || `job_${Date.now()}`;
    const initialJob: ActiveJob = {
      id: jobId,
      workspaceId: strategy.id,
      type: 'SOVEREIGN_LOOP',
      status: 'running',
      payload: { strategy },
      thoughts: thoughts,
      lastUpdate: new Date().toISOString()
    };
    
    if (!resumeId) await saveJob(initialJob);

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
      addLog('Master Brain', 'Sovereign Protocol successfully concluded.', 'success');
    } catch (e: any) {
      if (e.message === 'SOVEREIGN_KEY_EXPIRED' || e.message?.includes('API_KEY')) {
        setNeedsNewKey(true);
        addLog('System', 'Identity Error: Please select a valid API Key.', 'critical');
      } else {
        addLog('System', `Loop interrupted: ${e.message}`, 'warning');
      }
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 border-b-2 border-white/10 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 bg-[#c5a059]"></div>
             <span className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">{t('intelligence.autonomous_core')}</span>
          </div>
          <h2 className="text-4xl lg:text-6xl prestige-heading text-white italic">{t('intelligence.logic_narrative')}</h2>
        </div>
        
        <div className="flex gap-4">
          {needsNewKey ? (
            <button 
              onClick={handleKeyRenewal}
              className="square-button bg-red-600 text-white text-xs font-black shadow-2xl animate-pulse"
            >
              <i className="fas fa-key mr-2"></i> RENEW SOVEREIGN KEY
            </button>
          ) : (
            thoughts.length > 0 && !isRunning && (
              <button 
                onClick={() => runSystem(activeJobs[0]?.id)}
                className="square-button bg-[#c5a059] text-black text-xs font-black shadow-2xl hover:scale-105 transition-transform"
              >
                <i className="fas fa-redo-alt mr-2"></i> {t('intelligence.resumingSession') || 'RESUME PROTOCOL'}
              </button>
            )
          )}
          
          <button 
            onClick={() => runSystem()}
            disabled={isRunning || needsNewKey}
            className={`square-button text-black text-xs font-black ${needsNewKey ? 'bg-white/20 cursor-not-allowed' : 'bg-white'}`}
          >
            {isRunning ? (
              <><i className="fas fa-sync fa-spin"></i> CALIBRATING_LOGIC</>
            ) : (
              <><i className="fas fa-bolt"></i> ENGAGE_CORE_PROTOCOL</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-0 border-2 border-white/10">
        <div className="col-span-12 lg:col-span-8 h-[600px] flex flex-col bg-[#050505] border-r-2 border-white/10">
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center">
            <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">{t('intelligence.system_output')}</span>
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
              <div key={i} className={`flex gap-8 group animate-precision border-l-2 pl-8 py-2 transition-all ${thought.status === 'failed' ? 'border-red-500 bg-red-500/5' : 'border-white/10 hover:border-[#c5a059]'}`}>
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${thought.status === 'thinking' ? 'text-[#c5a059] animate-pulse' : thought.status === 'failed' ? 'text-red-500' : 'text-slate-500'}`}>
                      {thought.role} // {thought.status === 'thinking' ? 'PROCESSING' : thought.status === 'failed' ? 'INTERRUPTED' : 'RESOLVED'}
                    </span>
                    <span className="text-[9px] text-slate-700 font-mono">[{thought.timestamp}]</span>
                  </div>
                  <p className={`text-lg leading-relaxed prestige-heading italic ${thought.status === 'failed' ? 'text-red-400' : 'text-white/90'}`}>
                    "<SecureMessageRenderer text={thought.message} />"
                  </p>
                </div>
              </div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 p-10 bg-white/2 space-y-10">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-[#c5a059] uppercase tracking-widest">{t('intelligence.core_calibration')}</h4>
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
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">{t('intelligence.pulse_status')}</h4>
            <div className="text-xs text-slate-400 leading-relaxed font-mono space-y-2">
              <p>The engine is monitoring real-time liquidity signals while executing the loop. Resumption logic is active.</p>
              {needsNewKey && <p className="text-red-400 font-black">// ACTION REQUIRED: RE-AUTHENTICATE KEY TO CONTINUE.</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlCenter;
