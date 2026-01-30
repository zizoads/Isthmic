
import React from 'react';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'critical';
  agent: string;
}

interface Props {
  notifications: Notification[];
  onDismiss: (id: string) => void;
}

const SonnerNotification: React.FC<Props> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed bottom-16 lg:bottom-10 right-4 lg:right-10 z-[1000] space-y-4 max-w-[calc(100vw-2rem)] lg:max-w-md pointer-events-none" dir="ltr">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className="pointer-events-auto bg-[#0a0a0a] border-2 border-white/20 p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex gap-6 animate-precision group relative overflow-hidden"
        >
          <div className={`w-2 h-full absolute left-0 top-0 ${
            n.type === 'success' ? 'bg-green-500' : 
            n.type === 'critical' ? 'bg-red-600' : 
            n.type === 'warning' ? 'bg-amber-500' : 'bg-[#c5a059]'
          }`}></div>
          
          <div className="flex-1 pl-2">
             <div className="flex justify-between items-center mb-2">
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${
                  n.type === 'critical' ? 'text-red-500' : 'text-[#c5a059]'
                }`}>{n.agent} // SYSTEM_ALERT</span>
                <button 
                  onClick={() => onDismiss(n.id)}
                  className="text-slate-700 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
             </div>
             <p className="text-xs text-white font-medium leading-relaxed font-mono">
               "{n.message}"
             </p>
          </div>
          
          {/* Subtle background industrial pattern for each notification */}
          <div className="absolute right-0 bottom-0 opacity-[0.03] text-4xl p-2">
             <i className="fas fa-cog fa-spin"></i>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SonnerNotification;
