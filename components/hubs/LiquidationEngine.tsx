
import React, { useState } from 'react';
import MessagingDashboard from '../MessagingDashboard';
import NegotiationDashboard from '../NegotiationDashboard';
import MarketplaceDashboard from '../MarketplaceDashboard';
import LiquidationWarRoom from '../LiquidationWarRoom';
import PrecisionLiquidationMatrix from '../PrecisionLiquidationMatrix';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const LiquidationEngine: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const [tool, setTool] = useState<'matrix' | 'war-room' | 'outreach' | 'negotiation'>('matrix');

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setTool('matrix')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'matrix' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'مصفوفة الإغلاق' : 'CLOSING MATRIX'}
        </button>
        <button onClick={() => setTool('war-room')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'war-room' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'غرفة العمليات' : 'WAR ROOM'}
        </button>
        <button onClick={() => setTool('outreach')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'outreach' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التسويق المباشر' : 'OUTREACH'}
        </button>
        <button onClick={() => setTool('negotiation')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'negotiation' ? 'bg-primary text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          {lang === 'ar' ? 'المفاوضات' : 'NEGOTIATION'}
        </button>
      </div>

      <div className="pt-4">
        {tool === 'matrix' && <PrecisionLiquidationMatrix domains={domains} lang={lang} />}
        {tool === 'war-room' && <LiquidationWarRoom domains={domains} lang={lang} />}
        {tool === 'outreach' && <MessagingDashboard domains={domains} setDomains={setDomains} />}
        {tool === 'negotiation' && <NegotiationDashboard domains={domains} setDomains={setDomains} />}
      </div>
    </div>
  );
};

export default LiquidationEngine;
