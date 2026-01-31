
import React, { useState, useEffect, useRef } from 'react';
import { Domain, NegotiationThread, NegotiationMessage, FAANGNegotiationReport } from '../types';
import { NegotiationService } from '../services/ai/NegotiationService';
import { useDomainContext } from '../context/DomainContext';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const NegotiationDashboard: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const { addLog } = useDomainContext();
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
    addLog('Auditor', `Deploying FAANG-Standard Forensic Suite for ${selectedDomain.name}...`, 'info');

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

      const { insight, report } = await NegotiationService.auditMessageDeep(thread, newMessage, selectedDomain.name);
      incoming.auditInsight = insight;
      incoming.faangReport = report;

      const updatedThread: NegotiationThread = {
        ...thread,
        currentLeverage: report.leverageScore,
        messages: [...thread.messages, incoming]
      };

      setDomains(prev => prev.map(d => 
        d.id === selectedDomain.id ? { ...d, negotiationThread: updatedThread, status: 'negotiating' } : d
      ));
      
      setSelectedDomain(prev => prev ? { ...prev, negotiationThread: updatedThread } : null);
      setNewMessage('');
      addLog('Auditor', `Deep Audit Complete. Current Leverage: ${report.leverageScore}%`, 'success');
    } catch (e) {
      addLog('System', 'Audit Engine Interrupted.', 'critical');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateCounter = async () => {
    if (!selectedDomain?.negotiationThread) return;
    setIsGeneratingCounter(true);
    addLog('Strategist', 'Synthesizing Optimal Response...', 'info');

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

      setDomains(prev => prev.map(d => 
        d.id === selectedDomain.id ? { ...d, negotiationThread: updatedThread } : d
      ));
      setSelectedDomain(prev => prev ? { ...prev, negotiationThread: updatedThread } : null);
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

  return (
    <div className="grid grid-cols-12 gap-8 h-[850px] animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
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

      {/* Main Interaction Hub */}
      <div className="col-span-6 flex flex-col bg-[#050505] border border-white/5 rounded-3xl overflow-hidden relative shadow-2xl">
        {selectedDomain ? (
          <>
            <header className="p-6 bg-white/2 border-b border-white/5 flex justify-between items-center">
              <div>
                <h4 className="text-white font-black text-xl italic">{selectedDomain.name}</h4>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Logic_Link_Encrypted
                </div>
              </div>
              <button 
                onClick={handleGenerateCounter}
                disabled={isGeneratingCounter}
                className="prestige-btn prestige-btn-gold !py-2 !px-6 !text-[9px]"
              >
                {isGeneratingCounter ? <i className="fas fa-sync fa-spin"></i> : <i className="fas fa-chess-knight"></i>}
                <span className="ml-2 uppercase">Synthesize AI Response</span>
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              {selectedDomain.negotiationThread?.messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === 'buyer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] p-6 rounded-2xl relative group
                    ${m.sender === 'buyer' ? 'bg-white/5 border border-white/10 text-white' : 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-100 shadow-xl'}`}>
                    <div className="text-[8px] font-black uppercase text-slate-500 mb-2 flex justify-between">
                       <span>{m.sender === 'ai_assistant' ? 'STRATEGIC_CORE' : m.sender}</span>
                       <span>{m.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed italic">"{m.content}"</p>
                    
                    {m.faangReport && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#c5a059] rounded-full flex items-center justify-center text-black text-xs shadow-lg shadow-[#c5a059]/20 cursor-help animate-bounce-slow" title="FAANG Deep Audit Ready">
                        <i className="fas fa-shield-halved"></i>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isAnalyzing && (
                <div className="flex justify-start animate-pulse">
                   <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#c5a059] rounded-full animate-ping"></div>
                      <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Deploying 4-Layer Forensic Suite...</span>
                   </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-white/2 border-t border-white/5">
              <div className="flex gap-4">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAuditMessage())}
                  placeholder="Feed incoming signal or draft response..."
                  className="flex-1 bg-black/40 border border-white/10 !p-4 text-sm font-mono text-white rounded-2xl outline-none focus:border-[#c5a059] resize-none h-20 shadow-inner"
                />
                <button 
                  onClick={handleAuditMessage}
                  disabled={isAnalyzing || !newMessage}
                  className="w-20 bg-white text-black rounded-2xl hover:bg-[#c5a059] transition-all flex items-center justify-center text-xl shadow-xl hover:scale-105 active:scale-95"
                >
                  {isAnalyzing ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-fingerprint"></i>}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-10 space-y-10">
             <i className="fas fa-satellite text-9xl"></i>
             <p className="text-xs font-black uppercase tracking-[1em]">Scanning_For_Tactical_Signals</p>
          </div>
        )}
      </div>

      {/* Right Sidebar: FAANG Forensic Terminal */}
      <div className="col-span-3 bg-black/80 border border-white/5 rounded-3xl p-8 flex flex-col shadow-2xl relative overflow-hidden">
        <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
           <i className="fas fa-terminal"></i> Deep_Forensic_Output
        </h3>
        
        <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar">
          {(() => {
            const lastMsgWithReport = selectedDomain?.negotiationThread?.messages.slice().reverse().find(m => m.faangReport);
            if (!lastMsgWithReport?.faangReport) return (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                 <i className="fas fa-dna text-4xl mb-4"></i>
                 <p className="text-[8px] font-black uppercase tracking-widest">Institutional_Memory_Empty</p>
              </div>
            );
            
            const report = lastMsgWithReport.faangReport;
            return (
              <div className="space-y-8 animate-slide-up">
                {/* Score Meters */}
                <div className="p-6 bg-white/2 border border-white/5 rounded-2xl text-center">
                   <div className="text-[9px] font-black text-slate-500 uppercase mb-3 tracking-widest">Master Leverage Index</div>
                   <div className={`text-5xl font-black italic ${report.leverageScore > 50 ? 'text-green-500' : 'text-amber-500'}`}>
                     {report.leverageScore}%
                   </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Quantitative Indicators</h4>
                  <PressureGauge label="Psychographic Resonance" value={report.quantitativeMetrics.psychographicScore} color="#818cf8" />
                  <PressureGauge label="Tactical Vulnerability" value={report.quantitativeMetrics.tacticalWeaknessScore} color="#f43f5e" />
                  <PressureGauge label="Financial Urgency" value={report.quantitativeMetrics.financialUrgencyScore} color="#10b981" />
                </div>

                {/* Narrative Summary */}
                <div className="p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                   <h4 className="text-[9px] font-black text-indigo-400 uppercase mb-4 tracking-widest flex items-center gap-2">
                     <i className="fas fa-file-contract"></i> Executive Narrative
                   </h4>
                   <p className="text-xs text-white leading-relaxed italic font-medium">"{report.executiveSummary}"</p>
                </div>

                {/* Red Flags & Risks */}
                <div className="space-y-4">
                   <label className="text-[9px] font-black text-red-500 uppercase tracking-widest block">Forensic Red Flags</label>
                   <div className="space-y-2">
                     {report.riskFlags.map((risk, i) => (
                       <div key={i} className={`p-4 rounded-xl border flex gap-3 items-start ${
                         risk.severity === 'HIGH' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/10 text-slate-400'
                       }`}>
                          <i className="fas fa-biohazard mt-1 text-[10px]"></i>
                          <div className="flex-1">
                             <div className="text-[8px] font-black uppercase mb-1">{risk.type} // {risk.severity}</div>
                             <p className="text-[10px] leading-tight italic">"{risk.evidence}"</p>
                          </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* Tactical Recommendations */}
                <div className="p-6 bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-2xl shadow-xl">
                   <h4 className="text-[9px] font-black text-[#c5a059] uppercase mb-6 flex justify-between items-center">
                     <span>Strategic Moves</span>
                     <i className="fas fa-chess"></i>
                   </h4>
                   <div className="space-y-6">
                     {report.recommendedActions.map((rec, i) => (
                       <div key={i} className="space-y-2 border-l-2 border-[#c5a059]/20 pl-4">
                          <div className="flex justify-between items-center text-[10px] font-black text-white italic">
                             <span>{rec.action}</span>
                             <span className="text-green-500">{rec.confidence}% Conf.</span>
                          </div>
                          <p className="text-[9px] text-slate-500 leading-tight uppercase font-bold">{rec.expectedOutcome}</p>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            );
          })()}
        </div>
        
        <i className="fas fa-crown absolute right-[-50px] bottom-[-50px] text-white/2 text-[250px] pointer-events-none rotate-12"></i>
      </div>
    </div>
  );
};

export default NegotiationDashboard;
