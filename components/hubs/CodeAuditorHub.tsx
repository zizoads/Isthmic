
import React, { useState } from 'react';
import { useDomainContext } from '../../context/DomainContext';
import { AutomatedCodeReview } from '../../quality/AutomatedCodeReview';
import PrestigeLoader from '../ui/PrestigeLoader';

const CodeAuditorHub: React.FC = () => {
  const { addLog } = useDomainContext();
  const [code, setCode] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [reviewResult, setReviewResult] = useState<any>(null);

  const runFullReview = async () => {
    if (!code) return;
    setIsAuditing(true);
    addLog('Quality Agent', 'Initiating Industrial Code Review...', 'info');

    try {
      const result = await AutomatedCodeReview.reviewCodeChange("Target_Artifact.ts", code);
      setReviewResult(result);
      
      const logType = result.decision === 'REJECT' ? 'critical' : result.decision === 'APPROVE' ? 'success' : 'warning';
      addLog('Quality Agent', `Review Decision: ${result.decision}. Risk Score: ${result.riskScore}%`, logType);
    } catch (e) {
      addLog('Quality Agent', 'Review pipeline collapsed.', 'critical');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="space-y-10 animate-precision">
      <header className="flex justify-between items-end border-b border-white/10 pb-8">
        <div className="space-y-2">
           <h2 className="text-4xl prestige-heading text-white italic leading-none">Quality Fortress</h2>
           <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em]">Automated Gatekeeper // Stage 2 Active</p>
        </div>
        <button 
          onClick={runFullReview}
          disabled={isAuditing || !code}
          className="prestige-btn prestige-btn-gold !py-4 !px-10"
        >
          {isAuditing ? <i className="fas fa-microscope fa-spin"></i> : <i className="fas fa-shield-virus"></i>}
          <span className="ml-2 uppercase">Validate Code Integrity</span>
        </button>
      </header>

      <div className="grid grid-cols-12 gap-8 min-h-[600px]">
        <div className="col-span-12 lg:col-span-7 flex flex-col bg-[#050507] border border-white/5 rounded-3xl overflow-hidden shadow-inner">
          <div className="p-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
             <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Source_Editor</span>
             <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500/20"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500/20"></div>
             </div>
          </div>
          <textarea 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="flex-1 bg-transparent border-none p-10 font-mono text-sm text-indigo-100/70 outline-none resize-none custom-scrollbar leading-relaxed"
            placeholder="// Inject code logic for automated forensic review..."
          />
        </div>

        <div className="col-span-12 lg:col-span-5 space-y-6 overflow-y-auto no-scrollbar">
          {isAuditing ? (
            <div className="h-full flex items-center justify-center">
               <PrestigeLoader label="Quality Agent Dissecting Code..." />
            </div>
          ) : !reviewResult ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/10 rounded-3xl p-20 text-center">
               <i className="fas fa-fingerprint text-7xl mb-6"></i>
               <p className="text-[10px] uppercase font-black tracking-[0.4em]">System_Idle: Awaiting_Input</p>
            </div>
          ) : (
            <div className="space-y-6 animate-slide-up pb-10">
              {/* Decision Card */}
              <div className={`p-10 rounded-3xl border-2 flex flex-col items-center gap-6 ${
                reviewResult.decision === 'REJECT' ? 'bg-red-500/5 border-red-500/30' : 
                reviewResult.decision === 'APPROVE' ? 'bg-green-500/5 border-green-500/30' : 
                'bg-amber-500/5 border-amber-500/30'
              }`}>
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center text-3xl shadow-2xl ${
                   reviewResult.decision === 'REJECT' ? 'bg-red-500 text-white' : 
                   reviewResult.decision === 'APPROVE' ? 'bg-green-500 text-white' : 
                   'bg-amber-500 text-black'
                 }`}>
                    <i className={`fas ${reviewResult.decision === 'REJECT' ? 'fa-times' : reviewResult.decision === 'APPROVE' ? 'fa-check' : 'fa-exclamation'}`}></i>
                 </div>
                 <div className="text-center">
                    <div className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Gatekeeper Decision</div>
                    <div className={`text-4xl font-black italic tracking-tighter ${
                      reviewResult.decision === 'REJECT' ? 'text-red-500' : 
                      reviewResult.decision === 'APPROVE' ? 'text-green-500' : 'text-amber-500'
                    }`}>
                      {reviewResult.decision}
                    </div>
                 </div>
              </div>

              {/* Risk Gauge */}
              <div className="square-card p-8 bg-black/40">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-[9px] font-black text-slate-500 uppercase">Aggregated Risk Score</span>
                    <span className={`text-lg font-black ${reviewResult.riskScore > 50 ? 'text-red-500' : 'text-green-500'}`}>{reviewResult.riskScore}%</span>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-1000 ${reviewResult.riskScore > 50 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${reviewResult.riskScore}%` }}></div>
                 </div>
              </div>

              {/* Findings List */}
              <div className="space-y-3">
                 <h4 className="text-[9px] font-black text-slate-600 uppercase tracking-widest pl-4">Forensic Findings</h4>
                 {reviewResult.findings.map((f: string, i: number) => (
                   <div key={i} className="p-5 bg-white/2 border border-white/5 rounded-2xl flex gap-4 items-start group hover:border-[#d4af37]/40 transition-all">
                      <div className="w-2 h-2 rounded-full bg-slate-700 mt-1.5 group-hover:bg-[#d4af37]"></div>
                      <p className="text-xs text-slate-400 font-medium italic leading-relaxed">"{f}"</p>
                   </div>
                 ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeAuditorHub;
