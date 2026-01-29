
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
  const [tool, setTool] = useState<'negotiation' | 'war-room' | 'outreach' | 'matrix'>('negotiation');

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide shadow-xl">
        <button onClick={() => setTool('negotiation')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'negotiation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' : 'text-slate-500 hover:text-foreground'}`}>
          NEGOTIATION WAR ROOM
        </button>
        <button onClick={() => setTool('outreach')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'outreach' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          OUTREACH
        </button>
        <button onClick={() => setTool('matrix')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'matrix' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          LIQUIDATION MATRIX
        </button>
        <button onClick={() => setTool('war-room')} className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'war-room' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}>
          LIVE RADAR
        </button>
      </div>

      <div className="pt-4">
        {tool === 'negotiation' && <NegotiationDashboard domains={domains} setDomains={setDomains} lang="en" />}
        {tool === 'outreach' && <MessagingDashboard domains={domains} setDomains={setDomains} />}
        {tool === 'matrix' && <PrecisionLiquidationMatrix domains={domains} lang="en" />}
        {tool === 'war-room' && <LiquidationWarRoom domains={domains} lang="en" />}
      </div>
    </div>
  );
};

export default LiquidationEngine;
