
import React, { useState, useEffect, useRef } from 'react';
import { Domain, NegotiationThread, NegotiationMessage, FAANGNegotiationReport, DealState } from '../types';
import { NegotiationService } from '../services/ai/NegotiationService';
import { useDomainContext } from '../context/DomainContext';
import DealRoadmap from './negotiation/DealRoadmap';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const { addLog, updateDomain } = useDomainContext();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCounter, setIsGeneratingCounter] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedDomain?.negotiationThread?.messages]);

  const handleAuditMessage = async () => {
    if (!selectedDomain || !newMessage.trim()) return;
    
    setIsAnalyzing(true);
    addLog('Auditor', `Deploying forensic suite for ${selectedDomain.name}...`, 'info');

    try {
      const incoming: NegotiationMessage = {
        id: crypto.randomUUID(),
        sender: 'buyer',
        content: newMessage,
        timestamp: new Date().toLocaleTimeString()
      };

      const thread = selectedDomain.negotiationThread || {
        id: crypto.randomUUID(),
        domainId: selectedDomain.id,
        buyerName: "Unknown Prospect",
        messages: [],
        overallStatus: 'active',
        currentLeverage: 50
      };

      // تنفيذ التدقيق واستنتاج الحالة
      const { insight, report, newState } = await NegotiationService.auditMessageDeep(thread, newMessage, selectedDomain.name);
      
      incoming.auditInsight = insight;
      incoming.faangReport = report;

      const updatedThread: NegotiationThread = {
        ...thread,
        currentLeverage: report.leverageScore,
        currentState: newState, // تحديث الحالة هنا
        messages: [...thread.messages, incoming]
      };

      const updatedDomain = { ...selectedDomain, negotiationThread: updatedThread, status: 'negotiating' as const };

      setDomains(prev => prev.map(d => d.id === selectedDomain.id ? updatedDomain : d));
      setSelectedDomain(updatedDomain);
      
      await updateDomain(updatedDomain);
      
      setNewMessage('');
      addLog('Auditor', `Analysis complete. Stage: ${newState?.currentState || 'UNKNOWN'}`, 'success');
    } catch (e) {
      addLog('System', 'Audit Engine Interrupted.', 'critical');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCounter = async () => {
    if (!selectedDomain?.negotiationThread) return;
    setIsGeneratingCounter(true);
    addLog('Strategist', 'Synthesizing Response...', 'info');

    try {
      const counterText = await NegotiationService.generateStrategicCounter(
        selectedDomain.negotiationThread,
        selectedDomain.name,
        selectedDomain.price * 0.8
      );

      const aiMsg: NegotiationMessage = {
        id: crypto.randomUUID(),
        sender: 'ai_assistant',
        content: counterText,
        timestamp: new Date().toLocaleTimeString()
      };

      const updatedThread: NegotiationThread = {
        ...selectedDomain.negotiationThread,
        messages: [...selectedDomain.negotiationThread.messages, aiMsg]
      };

      const updatedDomain = { ...selectedDomain, negotiationThread: updatedThread };

      setDomains(prev => prev.map(d => d.id === selectedDomain.id ? updatedDomain : d));
      setSelectedDomain(updatedDomain);
      
      await updateDomain(updatedDomain);
    } catch (e) {
      addLog('Strategist', 'Synthesis failed.', 'warning');
    } finally {
      setIsGeneratingCounter(false);
    }
  };

  const activeDomains = domains.filter(d => d.status === 'negotiating' || d.status === 'purchased').slice(0, 10);

  const PressureGauge = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="space-y-1">
      <div className="flex justify-between text-[8px] font-black uppercase text-slate-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full transition-all duration-1000" style={{ width: `${value}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );

  const messageCount = selectedDomain?.negotiationThread?.messages.length || 0;
  const isWindowFull = messageCount > NegotiationService.MAX_CONTEXT_MESSAGES;

  return (
    <div className="grid grid-cols-12 gap-6 h-[850px] animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Sidebar: Strategic Pipeline */}
      <div className="col-span-3 bg-black/40 border-r border-white/5 flex flex-col rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-white/5">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">War_Room_Registry</h3>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeDomains.map(d => (
            <div 
              key={d.id} 
              onClick={() => setSelectedDomain(d)}
              className={`p-6 cursor-pointer border-b border-white/5 transition-all
                ${selectedDomain?.id === d.id ? 'bg-[#c5a059] text-black' : 'hover:bg-white/2 text-slate-400'}`}
            >
              <div className="font-black italic text-lg">{d.name}</div>
              <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedDomain?.id === d.id ? 'text-black/60' : 'text-indigo-400'}`}>
                Leverage: {d.negotiationThread?.currentLeverage || 50}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Interaction Hub - Adjusted from 6 to 4 columns */}
      <div className="col-span-4 flex flex-col bg-[#050505] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
        {selectedDomain ? (
          <>
            <header className="p-6 bg-white/2 border-b border-white/5 flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-xl italic">{selectedDomain.name}</h4>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                      <div className={`w-1.5 h-1.5 rounded-full ${isWindowFull ? 'bg-amber-500' : 'bg-indigo-500'}`}></div>
                      <span className="text-[8px] font-black text-slate-400 uppercase">
                        Window: {messageCount}/{NegotiationService.MAX_CONTEXT_MESSAGES}
                      </span>
                   </div>
                </div>
              </div>
              <button 
                onClick={handleGenerateCounter}
                disabled={isGeneratingCounter}
                className="prestige-btn prestige-btn-gold !py-2 !px-4 !text-[8px]"
              >
                {isGeneratingCounter ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-chess-knight"></i>}
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
              {selectedDomain.negotiationThread?.messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[90%] p-4 rounded-2xl relative
                    ${m.sender === 'buyer' ? 'bg-white/5 border border-white/10 text-white' : 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-100'}`}>
                    <div className="text-[7px] font-black uppercase text-slate-500 mb-2 flex justify-between">
                       <span>{m.sender.toUpperCase()}</span>
                       <span>{m.timestamp}</span>
                    </div>
                    <p className="text-xs font-medium leading-relaxed italic">"{m.content}"</p>
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-ping"></div>
                      <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Inference_Active...</span>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/2 border-t border-white/5">
              <div className="flex gap-3">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Feed incoming signal..."
                  className="flex-1 bg-black/40 border border-white/10 !p-4 text-xs font-mono text-white rounded-xl outline-none focus:border-[#c5a059] resize-none h-16 shadow-inner"
                />
                <button 
                  onClick={handleAuditMessage}
                  disabled={isAnalyzing || !newMessage}
                  className="w-16 bg-white text-black rounded-xl hover:bg-[#c5a059] transition-all flex items-center justify-center text-lg"
                >
                  {isAnalyzing ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-fingerprint"></i>}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-10">
             <i className="fas fa-satellite text-9xl"></i>
             <p className="text-xs font-black uppercase tracking-[1em]">Awaiting_Strategic_Link</p>
          </div>
        )}
      </div>

      {/* Phase 3 Component: Deal Roadmap - 2 columns */}
      <div className="col-span-2 h-full">
         <DealRoadmap dealState={selectedDomain?.negotiationThread?.currentState} lang={lang} />
      </div>

      {/* Right Sidebar: Forensic Terminal - 3 columns */}
      <div className="col-span-3 bg-black/80 border border-white/5 rounded-3xl p-6 flex flex-col shadow-2xl relative overflow-hidden">
        <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
           <i className="fas fa-terminal"></i> FORENSIC_INTEL
        </h3>
        
        <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
          {(() => {
            const lastMsgWithReport = selectedDomain?.negotiationThread?.messages.slice().reverse().find(m => m.faangReport);
            if (!lastMsgWithReport?.faangReport) return (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                 <i className="fas fa-dna text-3xl mb-4"></i>
                 <p className="text-[8px] font-black uppercase tracking-widest">Memory_Empty</p>
              </div>
            );
            
            const report = lastMsgWithReport.faangReport;
            
            return (
              <div className="space-y-6 animate-slide-up">
                <div className="p-4 bg-white/2 border border-white/5 rounded-2xl text-center">
                   <div className="text-[8px] font-black text-slate-500 uppercase mb-2 tracking-widest">Master Leverage</div>
                   <div className={`text-4xl font-black italic ${report.leverageScore > 50 ? 'text-green-500' : 'text-amber-500'}`}>
                     {report.leverageScore}%
                   </div>
                </div>

                <div className="space-y-3">
                  <PressureGauge label="Psychographic" value={report.quantitativeMetrics.psychographicScore} color="#818cf8" />
                  <PressureGauge label="Vulnerability" value={report.quantitativeMetrics.tacticalWeaknessScore} color="#f43f5e" />
                  <PressureGauge label="Financial Urgency" value={report.quantitativeMetrics.financialUrgencyScore} color="#10b981" />
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                   <h4 className="text-[8px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Executive Narrative</h4>
                   <p className="text-[10px] text-white leading-relaxed italic font-medium">"{report.executiveSummary}"</p>
                </div>

                <div className="space-y-3">
                   <label className="text-[8px] font-black text-red-500 uppercase tracking-widest block">Red Flags</label>
                   <div className="space-y-2">
                     {report.riskFlags.slice(0, 2).map((risk, i) => (
                       <div key={i} className={`p-3 rounded-lg border flex gap-2 items-start ${
                         risk.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'
                       }`}>
                          <div className="flex-1">
                             <div className="text-[7px] font-black uppercase mb-1">{risk.type}</div>
                             <p className="text-[9px] leading-tight italic">"{risk.evidence}"</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default NegotiationDashboard;
