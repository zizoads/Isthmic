
import React from 'react';
import { ActivityLog } from '../../types';

interface Props {
  notifications: ActivityLog[];
  onDismiss: (id: string) => void;
}

const SonnerNotification: React.FC<Props> = ({ notifications, onDismiss }) => {
  // تصفية الإشعارات التي تتطلب استجابة أو ذات أولوية عالية فقط
  const filteredNotifications = notifications.slice(0, 3);

  if (filteredNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-12 right-4 lg:right-12 z-[2000] space-y-3 max-w-[calc(100vw-2rem)] lg:max-w-[320px] pointer-events-none" dir="ltr">
      {filteredNotifications.map((n) => (
        <div 
          key={n.id}
          className={`pointer-events-auto backdrop-blur-3xl border p-4 rounded-[24px] shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex flex-col gap-2 animate-slide-up group relative overflow-hidden transition-all
            ${n.type === 'critical' ? 'bg-red-500/10 border-red-500/20' : 
              n.type === 'warning' ? 'bg-amber-500/10 border-amber-500/20' : 
              n.type === 'success' ? 'bg-green-500/10 border-green-500/20' : 
              'bg-[#0f0f11]/90 border-white/10'}`}
        >
          {/* Decorative vertical bar */}
          <div className={`w-1 h-8 absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full
            ${n.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 
              n.type === 'critical' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 
              n.type === 'warning' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 
              'bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.4)]'}`}
          />
          
          <div className="flex-1 pl-2">
             <div className="flex justify-between items-center mb-1">
                <span className={`text-[8px] font-black uppercase tracking-[0.2em]
                  ${n.type === 'critical' ? 'text-red-500' : 'text-[#d4af37]'}`}>
                  {n.agent} // SIGNAL
                </span>
                <button 
                  onClick={() => onDismiss(n.id)}
                  className="text-slate-600 hover:text-white transition-colors p-1"
                >
                  <i className="fas fa-times text-[8px]"></i>
                </button>
             </div>
             
             <p className="text-[11px] text-white font-medium leading-tight italic opacity-90 pr-4">
               "{n.message}"
             </p>

             {n.actionLabel && (
               <div className="mt-5 pt-4 border-t border-white/5">
                  <button 
                    onClick={() => {
                      if (n.onAction) n.onAction(n.actionPayload);
                      onDismiss(n.id);
                    }}
                    className={`w-full py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-xl
                      ${n.type === 'warning' || n.type === 'critical' 
                        ? 'bg-white text-black hover:bg-[#d4af37] hover:text-white' 
                        : 'bg-white/5 text-slate-300 hover:bg-white hover:text-black'}`}
                  >
                    {n.actionLabel}
                  </button>
               </div>
             )}
          </div>
          
          {/* Subtle background icon */}
          <i className={`fas absolute right-[-20px] bottom-[-20px] text-[80px] opacity-[0.03] rotate-12 transition-all group-hover:opacity-[0.05]
            ${n.type === 'critical' ? 'fa-biohazard' : 
              n.type === 'warning' ? 'fa-exclamation-triangle' : 
              n.type === 'success' ? 'fa-check-double' : 'fa-bell'}`}
          />
        </div>
      ))}
    </div>
  );
};

export default SonnerNotification;
