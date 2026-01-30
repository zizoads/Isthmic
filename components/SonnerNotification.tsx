
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
  // CRITICAL FILTER: Maintaining only meaningful signals for the Prestige UI
  const filteredNotifications = notifications.filter(n => {
    const msg = n.message.toLowerCase();
    return !msg.includes('denied') && 
           !msg.includes('protocol') &&
           !msg.includes('identity') &&
           !msg.includes('auth') &&
           !msg.includes('sync') &&
           !msg.includes('supabase');
  }).slice(0, 3);

  if (filteredNotifications.length === 0) return null;

  return (
    <div className="fixed bottom-16 lg:bottom-12 right-4 lg:right-12 z-[2000] space-y-4 max-w-[calc(100vw-2rem)] lg:max-w-sm pointer-events-none" dir="ltr">
      {filteredNotifications.map((n) => (
        <div 
          key={n.id}
          className="pointer-events-auto bg-[#0f0f11] backdrop-blur-3xl border border-white/10 p-5 rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex gap-4 animate-slide-up group relative overflow-hidden"
        >
          <div className={`w-1 h-12 absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full ${
            n.type === 'success' ? 'bg-green-500 shadow-[0_0_10px_green]' : 
            n.type === 'critical' ? 'bg-[#ff3333] shadow-[0_0_10px_red]' : 
            n.type === 'warning' ? 'bg-amber-500' : 'bg-[#d4af37]'
          }`}></div>
          
          <div className="flex-1 pl-2">
             <div className="flex justify-between items-center mb-1.5">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#d4af37]">{n.agent} // SIGNAL</span>
                <button 
                  onClick={() => onDismiss(n.id)}
                  className="text-slate-700 hover:text-white transition-colors"
                >
                  <i className="fas fa-times text-[10px]"></i>
                </button>
             </div>
             <p className="text-[11px] text-white font-medium leading-relaxed italic opacity-80">
               "{n.message}"
             </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SonnerNotification;
