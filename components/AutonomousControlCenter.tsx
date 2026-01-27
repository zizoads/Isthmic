
import React, { useState } from 'react';
import { AgentThought, PlatformStrategy, AutonomousAction } from '../types';
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

  const runSystem = async () => {
    setIsRunning(true);
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
    <div className="space-y-10 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Executive Overview Panel */}
      <div className="bg-[#05070a] border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
          <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-3 h-3 rounded-full ${isRunning ? 'bg-green-500 animate-pulse' : 'bg-slate-700'}`}></div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                {lang === 'ar' ? 'العقل المدبر السيادي' : 'SOVEREIGN MASTERMIND'}
              </h2>
            </div>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed italic">
              {lang === 'ar' 
                ? 'النظام يعمل كمدير تنفيذي آلي. يتم الآن تنفيذ دورات "حقن القيمة" وتجهيز عروض الاستحواذ دون تدخل بشري.'
                : 'System operating as an Autonomous CEO. Executing Value-Injection loops and synthesizing acquisition offers automatically.'}
            </p>
          </div>
          
          <button 
            onClick={runSystem}
            disabled={isRunning}
            className={`px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${
              isRunning 
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
              : 'bg-indigo-600 text-white hover:bg-white hover:text-indigo-600 scale-105 active:scale-95'
            }`}
          >
            {isRunning ? (
              <span className="flex items-center gap-3">
                <i className="fas fa-brain fa-spin"></i> {lang === 'ar' ? 'المدير يتخذ قراراً...' : 'CEO IN SESSION...'}
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <i className="fas fa-bolt"></i> {lang === 'ar' ? 'تفعيل الوضع السيادي' : 'LAUNCH SOVEREIGN MODE'}
              </span>
            )}
          </button>
        </div>
        <i className="fas fa-chess-king absolute right-[-50px] bottom-[-50px] text-white/5 text-[280px] pointer-events-none -rotate-12"></i>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thought Stream: LEFT */}
        <div className="lg:col-span-4 bg-[#0b0e14] border border-white/5 rounded-[40px] p-8 h-[650px] flex flex-col shadow-inner overflow-hidden">
          <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
             <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">سلسلة الاستدلال (Chain of Thought)</h3>
             <span className="text-[8px] font-mono text-slate-600">RT-FEED</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-4 scrollbar-hide">
            {thoughts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                <i className="fas fa-terminal text-4xl mb-4 text-slate-600"></i>
                <p className="text-[9px] font-black uppercase tracking-widest">Idle - Waiting for Pulse</p>
              </div>
            ) : thoughts.map((thought, i) => (
              <div key={i} className={`p-5 rounded-2xl border transition-all ${
                thought.status === 'thinking' ? 'bg-indigo-500/5 border-indigo-500/20 animate-pulse' : 'bg-white/2 border-white/5'
              }`}>
                <div className="flex justify-between items-center mb-2">
                   <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">{thought.role}</span>
                   <span className="text-[8px] text-slate-600 font-mono">{thought.timestamp}</span>
                </div>
                <p className={`text-[10px] font-medium leading-relaxed ${thought.status === 'thinking' ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {thought.message}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Sovereign Ledger: CENTER */}
        <div className="lg:col-span-5 bg-[#0b0e14] border border-white/5 rounded-[40px] p-8 h-[650px] flex flex-col shadow-inner">
           <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">الدفتر السيادي (Sovereign Ledger)</h3>
             <span className="text-[8px] font-mono text-green-500">AUTONOMOUS ACTIONS</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-6 scrollbar-hide">
             {actions.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20">
                 <i className="fas fa-file-invoice-dollar text-4xl mb-4 text-slate-600"></i>
                 <p className="text-[9px] font-black uppercase tracking-widest">No Actions Logged</p>
               </div>
             ) : actions.map((action, i) => (
               <div key={i} className="bg-white/2 border border-white/5 p-6 rounded-3xl group hover:border-indigo-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                     <div>
                        <span className="text-[8px] font-black text-indigo-400 uppercase block mb-1">{action.type}</span>
                        <h4 className="text-sm font-black text-white">{action.domainName}</h4>
                     </div>
                     <div className="text-right">
                        <div className="text-lg font-black text-green-500">+{action.impactScore}%</div>
                        <div className="text-[7px] font-black text-slate-600 uppercase">Impact Score</div>
                     </div>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic border-r-2 border-indigo-500/20 pr-4">
                    "{action.description}"
                  </p>
               </div>
             ))}
          </div>
        </div>

        {/* Cognitive & Simulation Stats: RIGHT */}
        <div className="lg:col-span-3 space-y-8">
           <div className="bg-[#0b0e14] border border-white/5 rounded-[40px] p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8">حالة المحرك (System Pulse)</h4>
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] text-slate-400 font-bold uppercase">قوة الاستدلال</span>
                       <span className="text-xs font-black text-indigo-400">98.4%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="bg-indigo-500 h-full" style={{ width: '98%' }}></div>
                    </div>
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[9px] text-slate-400 font-bold uppercase">كفاءة التسييل</span>
                       <span className="text-xs font-black text-green-500">76%</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                       <div className="bg-green-500 h-full" style={{ width: '76%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-[40px] p-8 flex flex-col items-center text-center justify-center space-y-6 py-12">
              <div className="relative">
                 <div className="w-24 h-24 bg-indigo-600/10 rounded-full flex items-center justify-center text-4xl text-indigo-400 border border-indigo-500/30">
                    <i className="fas fa-shield-halved"></i>
                 </div>
                 <div className="absolute -top-2 -right-2 bg-green-500 w-4 h-4 rounded-full border-2 border-[#0b0e14] animate-ping"></div>
              </div>
              <div>
                 <h5 className="text-white font-black text-xs uppercase tracking-widest">إدارة المخاطر</h5>
                 <p className="text-[9px] text-indigo-300/60 mt-2 font-medium leading-relaxed">
                    النظام يقوم بحظر 14% من الصفقات آلياً بسبب مخاطر الملكية الفكرية.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AutonomousControlCenter;
