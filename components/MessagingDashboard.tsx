
import React, { useState } from 'react';
import { Domain, OutreachMessage } from '../types';
import { findStrategicAcquirersAI, generatePersonaPitchAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const MessagingDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [prospects, setProspects] = useState<any[]>([]);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [isProspecting, setIsProspecting] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const handleProspect = async (domain: Domain) => {
    setIsProspecting(domain.id);
    setSelectedDomain(domain);
    const leads = await findStrategicAcquirersAI(domain.name, domain.sector || 'Technology');
    setProspects(leads);
    setIsProspecting(null);
  };

  const handleGeneratePitch = async (company: any, persona: string) => {
    if (!selectedDomain) return;
    setIsGeneratingPitch(true);
    const content = await generatePersonaPitchAI(selectedDomain.name, company, persona);
    
    const newMessage: OutreachMessage = {
      id: Math.random().toString(),
      domainId: selectedDomain.id,
      recipient: company.companyName,
      recipientRole: persona,
      tone: 'Formal',
      status: 'draft',
      content: content || ''
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setIsGeneratingPitch(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Column */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm flex flex-col h-[700px]">
          <div className="p-6 border-b bg-slate-50/50">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Asset</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleProspect(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{d.sector}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prospecting Column */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-sm flex flex-col h-[700px] relative overflow-hidden">
          {isProspecting ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scouting Strategic Acquirers...</p>
            </div>
          ) : prospects.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="p-8 border-b flex justify-between items-center">
                 <div>
                    <h3 className="font-black text-slate-800 uppercase text-lg tracking-tighter">Strategic Leads</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Companies with high acquisition synergy</p>
                 </div>
                 <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">{prospects.length} FOUND</span>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {prospects.map((company, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-indigo-200 transition-all group">
                     <div className="flex justify-between items-start mb-4">
                        <div className="font-black text-slate-900 text-lg">{company.companyName}</div>
                        <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${
                          company.buyingPower === 'High' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>Power: {company.buyingPower}</span>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 italic">
                        "{company.reason}"
                     </p>
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleGeneratePitch(company, 'CEO / Founder')}
                          className="py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all"
                        >
                          Pitch Founder
                        </button>
                        <button 
                          onClick={() => handleGeneratePitch(company, 'Marketing Director')}
                          className="py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all"
                        >
                          Pitch Marketing
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-radar text-6xl mb-6 opacity-10"></i>
               <p className="italic text-sm">Select a purchased asset to begin strategic lead prospecting.</p>
            </div>
          )}
        </div>

        {/* Drafts Column */}
        <div className="lg:col-span-1 bg-slate-900 rounded-[40px] text-white flex flex-col h-[700px] overflow-hidden">
          <div className="p-8 border-b border-white/5 bg-white/5">
             <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Outbound Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/5 rounded-2xl p-5 border border-white/10 relative group">
                 <div className="text-[9px] font-black text-indigo-300 uppercase mb-2">{msg.recipientRole} @ {msg.recipient}</div>
                 <p className="text-[11px] text-slate-300 leading-relaxed italic mb-4 line-clamp-3">
                   "{msg.content}"
                 </p>
                 <button className="w-full py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-500 transition-all">
                    Deliver Pitch
                 </button>
              </div>
            ))}
            {messages.length === 0 && !isGeneratingPitch && (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <i className="fas fa-paper-plane text-4xl mb-4"></i>
                <p className="text-[10px] font-black uppercase">Queue Empty</p>
              </div>
            )}
            {isGeneratingPitch && (
              <div className="animate-pulse bg-white/5 rounded-2xl h-32 w-full"></div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagingDashboard;
