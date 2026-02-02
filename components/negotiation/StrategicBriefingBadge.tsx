
import React, { useState } from 'react';
import { StrategicObjective, AlignmentReport, ObjectiveStatus } from '../../types';

interface Props {
  objectives: StrategicObjective[];
  lang: 'ar' | 'en';
}

/**
 * StrategicBriefingBadge: Silent Observer UI.
 * Only appears when alignment is AT_RISK or DEVIATED.
 */
const StrategicBriefingBadge: React.FC<Props> = ({ objectives, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const riskyObjectives = objectives.filter(o => 
    o.status === 'AT_RISK' || o.status === 'DEVIATED'
  );

  if (riskyObjectives.length === 0) return null;

  return (
    <div className="fixed top-24 right-12 z-[500] animate-precision">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-red-600 text-white px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-red-500/50 hover:scale-105 transition-all"
      >
        <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
        <span className="text-[10px] font-black uppercase tracking-widest">
           {lang === 'ar' ? 'تنبيه استراتيجي' : 'STRATEGIC_ALERT'} ({riskyObjectives.length})
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-14 right-0 w-80 bg-[#0a0a0c] border border-red-500/30 rounded-3xl p-6 shadow-2xl animate-slide-up">
          <h4 className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-4 border-b border-red-500/20 pb-2">Deviation_Detected</h4>
          <div className="space-y-6">
            {riskyObjectives.map(obj => {
              const lastReport = obj.alignmentHistory[0];
              return (
                <div key={obj.id} className="space-y-2">
                  <div className="text-white text-xs font-bold italic">"{obj.description}"</div>
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    {lastReport?.reasoning || (lang === 'ar' ? 'تم رصد انحراف تكتيكي في المفاوضات.' : 'Tactical drift detected in negotiation.')}
                  </p>
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                     <span className="text-[8px] font-black text-red-400 uppercase block mb-1">Commander Recommendation:</span>
                     <span className="text-[10px] text-red-100 font-medium">
                       {lastReport?.suggestedAdjustment || (lang === 'ar' ? 'راجع شروط السعر الأدنى فوراً.' : 'Review floor price terms immediately.')}
                     </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategicBriefingBadge;
