
import React, { useState } from 'react';
import MessagingDashboard from '../MessagingDashboard';
import NegotiationDashboard from '../NegotiationDashboard';
import MarketplaceDashboard from '../MarketplaceDashboard';
import AuctionWatchDashboard from '../AuctionWatchDashboard';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const LiquidationEngine: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const [tool, setTool] = useState<'outreach' | 'negotiation' | 'marketplace' | 'radar'>('outreach');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex bg-accent/50 p-1 rounded-2xl border border-border w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide">
        <button onClick={() => setTool('outreach')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'outreach' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'التسويق المباشر' : 'Outreach'}
        </button>
        <button onClick={() => setTool('negotiation')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'negotiation' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'غرفة المفاوضات' : 'Negotiation'}
        </button>
        <button onClick={() => setTool('marketplace')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'marketplace' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'إدارة المنصات' : 'Marketplace'}
        </button>
        <button onClick={() => setTool('radar')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${tool === 'radar' ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:text-foreground'}`}>
          {lang === 'ar' ? 'رادار المزادات' : 'Auction Radar'}
        </button>
      </div>

      <div className="pt-4">
        {tool === 'outreach' && <MessagingDashboard domains={domains} setDomains={setDomains} />}
        {tool === 'negotiation' && <NegotiationDashboard domains={domains} setDomains={setDomains} />}
        {tool === 'marketplace' && <MarketplaceDashboard domains={domains} />}
        {tool === 'radar' && <AuctionWatchDashboard domains={domains} />}
      </div>
    </div>
  );
};

export default LiquidationEngine;
