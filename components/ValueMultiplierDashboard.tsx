
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateLeadGenBlueprintAI, harvestBulkLeadsAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
}

const ValueMultiplierDashboard: React.FC<Props> = ({ domains }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [blueprint, setBlueprint] = useState<any>(null);
  const [bulkLeads, setBulkLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleMultiplyValue = async (domain: Domain) => {
    setIsLoading(true);
    setSelectedDomain(domain);
    const [bp, leads] = await Promise.all([
      generateLeadGenBlueprintAI(domain.name, domain.sector || 'Technology'),
      harvestBulkLeadsAI(domain.name, domain.sector || 'Technology')
    ]);
    setBlueprint(bp);
    setBulkLeads(leads);
    setIsLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Asset Selection */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm flex flex-col h-[800px]">
          <div className="p-6 border-b bg-slate-50/50">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Asset to Multiply</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleMultiplyValue(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                <div className="text-[9px] text-indigo-500 font-black uppercase mt-1">Ready for Scaling</div>
              </div>
            ))}
          </div>
        </div>

        {/* Multiplication Console */}
        <div className="lg:col-span-3 min-h-[800px] relative">
          {!selectedDomain ? (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-layer-group text-7xl mb-6 opacity-10"></i>
               <p className="italic text-sm">Select an asset to engineer its business blueprint.</p>
            </div>
          ) : isLoading ? (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-slate-900 border-t-indigo-500 rounded-full animate-spin"></div>
               <p className="text-xs font-black uppercase tracking-widest">Engineering Business Value & Prospecting...</p>
            </div>
          ) : (
            <div className="space-y-8 h-full overflow-y-auto pb-10 scrollbar-hide">
              
              {/* Top Banner: Revenue Concept */}
              <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden">
                <div className="relative z-10">
                   <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Lead-Gen Revenue Blueprint</h3>
                   <div className="text-3xl font-black tracking-tighter">{selectedDomain.name}</div>
                   <p className="text-sm text-slate-400 mt-4 max-w-lg italic leading-relaxed">
                     "This domain isn't just a name; it's a lead magnet. We've mapped its path to generating high-ticket inbound sales."
                   </p>
                </div>
                <div className="relative z-10 bg-white/5 border border-white/10 p-6 rounded-3xl text-center min-w-[200px]">
                   <div className="text-[9px] font-black text-indigo-300 uppercase">Estimated Value Per Lead</div>
                   <div className="text-4xl font-black text-indigo-400 mt-1">${blueprint.revenueModel.estimatedCPL}</div>
                </div>
                <i className="fas fa-money-bill-wave absolute right-[-20px] top-[-20px] text-white/5 text-[150px]"></i>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {/* Lead-Gen Structure */}
                 <div className="bg-white p-10 rounded-[40px] border shadow-sm space-y-8">
                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <i className="fas fa-bullseye text-indigo-500"></i> High-Value Verticals
                       </h4>
                       <div className="space-y-3">
                          {blueprint.services.map((s: string, i: number) => (
                             <div key={i} className="p-4 bg-slate-50 border rounded-2xl text-[11px] font-bold text-slate-700 flex items-center gap-3">
                                <span className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[10px] shadow-sm">{i+1}</span>
                                {s}
                             </div>
                          ))}
                       </div>
                    </div>

                    <div>
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                          <i className="fas fa-wpforms text-indigo-500"></i> Conversion Psychology Hook
                       </h4>
                       <div className="p-6 bg-indigo-50 rounded-2xl text-xs text-indigo-900 font-medium italic border border-indigo-100">
                          "{blueprint.formStructure.psychologyHook}"
                       </div>
                    </div>
                 </div>

                 {/* Bulk Prospecting Intelligence */}
                 <div className="bg-white p-10 rounded-[40px] border shadow-sm flex flex-col h-[500px]">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex justify-between items-center">
                       <span>Strategic Acquirers (Bulk Harvest)</span>
                       <span className="bg-slate-100 px-3 py-1 rounded-full text-[9px]">{bulkLeads.length} Leads</span>
                    </h4>
                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
                       {bulkLeads.map((lead: any, i: number) => (
                          <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl hover:border-indigo-300 transition-all group">
                             <div className="flex justify-between items-start mb-2">
                                <div className="font-black text-slate-900 text-sm">{lead.companyName}</div>
                                <span className="text-[8px] font-black text-indigo-500 uppercase">{lead.estimatedValuation}</span>
                             </div>
                             <div className="text-[9px] text-slate-400 font-bold mb-3">{lead.currentDomain}</div>
                             <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2 italic mb-4">"{lead.synergyReason}"</p>
                             <button className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all">Generate Personalized Pitch</button>
                          </div>
                       ))}
                    </div>
                 </div>
              </div>

              {/* SEO Jumpstart Strategy */}
              <div className="bg-indigo-600 p-10 rounded-[40px] text-white">
                 <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-8">30-Day Value Injection Plan (SEO)</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {blueprint.seoJumpstart.map((step: string, i: number) => (
                       <div key={i} className="bg-white/10 p-5 rounded-3xl border border-white/10 flex flex-col items-center text-center">
                          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black mb-4">W{i+1}</div>
                          <p className="text-[10px] font-bold leading-relaxed">{step}</p>
                       </div>
                    ))}
                 </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ValueMultiplierDashboard;
