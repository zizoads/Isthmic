
import React from 'react';
import { DealState, DealStateEnum } from '../../types';

interface Props {
  dealState?: DealState;
  lang: 'ar' | 'en';
}

/**
 * DealRoadmap: Visual Sovereign Deal State Tracker.
 */
const DealRoadmap: React.FC<Props> = ({ dealState, lang }) => {
  const stages = [
    { key: DealStateEnum.INITIAL, label: lang === 'ar' ? 'البداية' : 'Initial' },
    { key: DealStateEnum.DISCOVERY, label: lang === 'ar' ? 'الاستكشاف' : 'Discovery' },
    { key: DealStateEnum.TENSION, label: lang === 'ar' ? 'المساومة' : 'Tension' },
    { key: DealStateEnum.AGREEMENT, label: lang === 'ar' ? 'الاتفاق' : 'Agreement' },
    { key: DealStateEnum.CLOSING, label: lang === 'ar' ? 'الإغلاق' : 'Closing' }
  ];

  if (!dealState) {
    return (
      <div className="bg-white/2 border border-white/5 rounded-3xl p-8 h-full flex flex-col items-center justify-center opacity-20 text-center">
        <i className="fas fa-map-marked-alt text-4xl mb-4"></i>
        <p className="text-[9px] font-black uppercase tracking-[0.3em]">Awaiting_State_Inference</p>
      </div>
    );
  }

  const currentIdx = stages.findIndex(s => s.key === dealState.currentState);
  const isSpecialState = [DealStateEnum.STALLED, DealStateEnum.LOST].includes(dealState.currentState);

  return (
    <div className="bg-[#08080a] border border-white/5 rounded-3xl p-6 flex flex-col h-full animate-precision shadow-2xl relative overflow-hidden">
      <h3 className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.4em] mb-8 flex items-center gap-2">
         <i className="fas fa-route"></i> {lang === 'ar' ? 'خارطة طريق الصفقة' : 'DEAL_ROADMAP'}
      </h3>

      {/* Progress Bar */}
      <div className="relative flex justify-between mb-12 px-2">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 -translate-y-1/2 z-0"></div>
        {stages.map((stage, i) => {
          const isCompleted = i < currentIdx;
          const isActive = i === currentIdx;
          return (
            <div key={stage.key} className="relative z-10 flex flex-col items-center gap-3">
              <div className={`w-3 h-3 rounded-full border-2 transition-all duration-700 
                ${isActive ? 'bg-[#c5a059] border-[#c5a059] shadow-[0_0_15px_#c5a059] scale-125' : 
                  isCompleted ? 'bg-indigo-500 border-indigo-500' : 'bg-black border-white/10'}`}>
              </div>
              <span className={`text-[8px] font-black uppercase tracking-tighter transition-colors 
                ${isActive ? 'text-[#c5a059]' : 'text-slate-600'}`}>{stage.label}</span>
            </div>
          );
        })}
      </div>

      {/* Current State Info Card */}
      <div className="space-y-6 flex-1">
        <div className={`p-5 rounded-2xl border transition-all ${isSpecialState ? 'bg-red-500/10 border-red-500/20' : 'bg-white/2 border-white/5'}`}>
          <div className="flex justify-between items-center mb-3">
             <span className={`text-[9px] font-black uppercase tracking-widest ${isSpecialState ? 'text-red-500' : 'text-indigo-400'}`}>
               {dealState.currentState}
             </span>
             <span className="text-[8px] font-mono text-slate-600">{Math.round(dealState.confidenceScore * 100)}% Conf.</span>
          </div>
          <p className="text-[11px] text-slate-300 italic leading-relaxed">
            "{dealState.transitionReason}"
          </p>
          <div className="mt-3 text-[7px] text-slate-600 font-mono uppercase">Updated: {new Date(dealState.lastUpdate).toLocaleTimeString()}</div>
        </div>

        {/* Tactical Action Box */}
        {dealState.suggestedAction && (
          <div className="p-5 bg-indigo-600/10 border border-indigo-500/30 rounded-2xl animate-slide-up">
            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <i className="fas fa-chess-knight"></i> {lang === 'ar' ? 'توصية تكتيكية' : 'TACTICAL_ACTION'}
            </h4>
            <p className="text-[11px] text-indigo-100 font-bold leading-relaxed">
              {dealState.suggestedAction}
            </p>
          </div>
        )}
      </div>

      <i className="fas fa-shield-halved absolute right-[-20px] bottom-[-20px] text-white/[0.02] text-[120px] -rotate-12"></i>
    </div>
  );
};

export default DealRoadmap;
