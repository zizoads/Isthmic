
import React from 'react';
import { Domain } from '../../types';

interface Props {
  status: Domain['status'];
  lang: 'ar' | 'en';
}

const StatusBadge: React.FC<Props> = ({ status, lang }) => {
  const config: Record<string, { color: string; bg: string; labelEn: string; labelAr: string; icon: string }> = {
    available: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.1)', labelEn: 'ALPHA_ASSET', labelAr: 'فرصة_ألفا', icon: 'fa-star' },
    processing: { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.05)', labelEn: 'ANALYZING', labelAr: 'تحليل_نشط', icon: 'fa-sync fa-spin' },
    purchased: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', labelEn: 'VAULTED', labelAr: 'مؤمن', icon: 'fa-lock' },
    negotiating: { color: '#818cf8', bg: 'rgba(129, 140, 248, 0.1)', labelEn: 'ENGAGED', labelAr: 'تفاوض_نشط', icon: 'fa-handshake' },
    sold: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', labelEn: 'LIQUIDATED', labelAr: 'تمت_التصفية', icon: 'fa-check-double' },
    watching: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', labelEn: 'MONITORING', labelAr: 'مراقب', icon: 'fa-eye' },
  };

  const { color, bg, labelEn, labelAr, icon } = config[status] || config.available;

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
      {lang === 'ar' ? labelAr : labelEn}
    </div>
  );
};

export default StatusBadge;
