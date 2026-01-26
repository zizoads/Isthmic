
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
    <div className="fixed bottom-10 left-10 z-[200] space-y-4 max-w-sm pointer-events-none" dir="rtl">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className="pointer-events-auto bg-[#0d1117] border border-white/10 rounded-2xl p-5 shadow-2xl flex gap-4 animate-slide-up group"
        >
          <div className={`w-1 h-full absolute right-0 top-0 rounded-r-2xl ${
            n.type === 'success' ? 'bg-green-500' : 
            n.type === 'critical' ? 'bg-red-500' : 'bg-indigo-500'
          }`}></div>
          <div className="flex-1">
             <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{n.agent}</div>
             <p className="text-xs text-slate-300 font-medium leading-relaxed">{n.message}</p>
          </div>
          <button 
            onClick={() => onDismiss(n.id)}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-[10px]"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default SonnerNotification;
