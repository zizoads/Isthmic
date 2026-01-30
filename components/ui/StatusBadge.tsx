
import React from 'react';
import { Domain } from '../../types';

interface Props {
  status: Domain['status'];
  lang: 'ar' | 'en';
}

const StatusBadge: React.FC<Props> = ({ status, lang }) => {
  const config: Record<string, { color: string; labelEn: string; labelAr: string }> = {
    available: { color: '#818cf8', labelEn: 'AVAILABLE', labelAr: 'متاح' },
    processing: { color: '#fbbf24', labelEn: 'PROCESSING', labelAr: 'قيد المعالجة' },
    purchased: { color: '#10b981', labelEn: 'SECURED', labelAr: 'تم التوثيق' },
    negotiating: { color: '#3b82f6', labelEn: 'NEGOTIATION', labelAr: 'تفاوض' },
    sold: { color: '#f43f5e', labelEn: 'LIQUIDATED', labelAr: 'تمت التصفية' },
    watching: { color: '#94a3b8', labelEn: 'WATCHING', labelAr: 'مراقب' },
  };

  const { color, labelEn, labelAr } = config[status] || config.available;

  return (
    <span 
      className="square-tag"
      style={{ color: color, borderColor: `${color}40` }}
    >
      {lang === 'ar' ? labelAr : labelEn}
    </span>
  );
};

export default StatusBadge;
