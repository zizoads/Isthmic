
import React, { useState } from 'react';
import MessagingDashboard from '../MessagingDashboard';
import NegotiationDashboard from '../NegotiationDashboard';
import MarketplaceDashboard from '../MarketplaceDashboard';
import AuctionWatchDashboard from '../AuctionWatchDashboard';
import LiquidationWarRoom from '../LiquidationWarRoom';
import PrecisionLiquidationMatrix from '../PrecisionLiquidationMatrix';
import { Domain } from '../../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  lang: 'ar' | 'en';
}

const LiquidationEngine: React.FC<Props> = ({ domains, setDomains, lang }) => {
  const [tool, setTool] = useState<'negotiation' | 'war-room' | 'outreach' | 'marketplace' | 'radar'>('negotiation');

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      <div className="flex bg-[#0b0e14] p-1.5 rounded-2xl border border-white/10 w-fit mx-auto lg:mx-0 overflow-x-auto max-w-full scrollbar-hide shadow-xl">
        {[
          { id: 'negotiation', label: 'WAR ROOM' },
          { id: 'outreach', label: 'OUTREACH' },
          { id: 'marketplace', label: 'GLOBAL SYNC' },
          { id: 'radar', label: 'MARKET RADAR' },
          { id: 'war-room', label: 'LIVE MONITOR' }
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setTool(tab.id as any)} 
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap
              ${tool === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-foreground'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-4">
        {tool === 'negotiation' && <NegotiationDashboard domains={domains} setDomains={setDomains} lang={lang} />}
        {tool === 'outreach' && <MessagingDashboard domains={domains} setDomains={setDomains} lang={lang} />}
        {/* Added lang prop to MarketplaceDashboard */}
        {tool === 'marketplace' && <MarketplaceDashboard domains={domains} lang={lang} />}
        {tool === 'radar' && <AuctionWatchDashboard domains={domains} />}
        {tool === 'war-room' && (
          <div className="space-y-12">
            <PrecisionLiquidationMatrix domains={domains} lang={lang} />
            <LiquidationWarRoom domains={domains} lang={lang} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LiquidationEngine;
