
import React from 'react';
import { Domain } from '../../types';

interface Props {
  status: Domain['status'];
  lang: 'ar' | 'en';
}

const StatusBadge: React.FC<Props> = ({ status, lang }) => {
  const config: Record<string, { bg: string; text: string; labelEn: string; labelAr: string }> = {
    available: { bg: 'bg-indigo-50 dark:bg-indigo-500/10', text: 'text-indigo-600 dark:text-indigo-400', labelEn: 'Available', labelAr: 'متاح' },
    processing: { bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', labelEn: 'Processing', labelAr: 'قيد المعالجة' },
    purchased: { bg: 'bg-green-50 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400', labelEn: 'Purchased', labelAr: 'تم الشراء' },
    negotiating: { bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', labelEn: 'Negotiating', labelAr: 'تفاوض' },
    sold: { bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', labelEn: 'Sold', labelAr: 'تم البيع' },
    watching: { bg: 'bg-slate-50 dark:bg-slate-500/10', text: 'text-slate-600 dark:text-slate-400', labelEn: 'Watching', labelAr: 'مراقب' },
  };

  const { bg, text, labelEn, labelAr } = config[status] || config.available;

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${bg} ${text} border border-current opacity-80`}>
      {lang === 'ar' ? labelAr : labelEn}
    </span>
  );
};

export default StatusBadge;
