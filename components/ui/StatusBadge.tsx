
import React from 'react';
import { Domain } from '../../types';

interface Props {
  status: Domain['status'];
  lang: 'ar' | 'en';
}

const StatusBadge: React.FC<Props> = ({ status, lang }) => {
  const config: Record<string, { color: string; bg: string; labelEn: string; labelAr: string }> = {
    available: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.1)', labelEn: 'ALPHA_ASSET', labelAr: 'فرصة_ألفا' },
    processing: { color: '#ffffff', bg: 'rgba(255, 255, 255, 0.05)', labelEn: 'ANALYZING', labelAr: 'تحليل_نشط' },
    purchased: { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', labelEn: 'VAULTED', labelAr: 'مؤمن' },
    negotiating: { color: '#d4af37', bg: 'rgba(212, 175, 55, 0.15)', labelEn: 'TACTICAL', labelAr: 'تفاوض' },
    sold: { color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)', labelEn: 'LIQUIDATED', labelAr: 'تمت_التصفية' },
    watching: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.1)', labelEn: 'MONITORING', labelAr: 'مراقب' },
  };

  const { color, bg, labelEn, labelAr } = config[status] || config.available;

  return (
    <span 
      className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all"
      style={{ 
        color: color, 
        backgroundColor: bg, 
        borderColor: `${color}20` 
      }}
    >
      {lang === 'ar' ? labelAr : labelEn}
    </span>
  );
};

export default StatusBadge;
