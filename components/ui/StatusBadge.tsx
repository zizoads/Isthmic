
import React from 'react';
import { Domain } from '../../types';

interface Props {
  status: Domain['status'];
}

const StatusBadge: React.FC<Props> = ({ status }) => {
  const config: Record<string, { color: string; bg: string; label: string; icon: string }> = {
    available: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.1)', label: 'ALPHA_ASSET', icon: 'fa-star' },
    processing: { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.05)', label: 'ANALYZING', icon: 'fa-sync fa-spin' },
    purchased: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', label: 'VAULTED', icon: 'fa-lock' },
    negotiating: { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)', label: 'ENGAGED', icon: 'fa-handshake' },
    sold: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', label: 'LIQUIDATED', icon: 'fa-check-double' },
    watching: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', label: 'MONITORING', icon: 'fa-eye' },
  };

  const { color, bg, label, icon } = config[status] || config.available;

  return (
    <div 
      className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border transition-all duration-500 shadow-sm"
      style={{ 
        color: color, 
        backgroundColor: bg, 
        borderColor: `${color}30` 
      }}
    >
      <i className={`fas ${icon} text-[8px]`}></i>
      {label}
    </div>
  );
};

export default StatusBadge;
