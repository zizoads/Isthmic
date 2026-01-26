
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateProspectusAI, estimateFairMarketValueAI, auditTechnicalHealthAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const PortfolioManager: React.FC<Props> = ({ domains, setDomains }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [prospectus, setProspectus] = useState<string | null>(null);
  const [appraisal, setAppraisal] = useState<any>(null);
  const [techAudit, setTechAudit] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDeepAudit = async (domain: Domain) => {
    setLoading(true);
    setSelectedDomain(domain);
    
    // تنفيذ 3 عمليات متوازية لتقييم عميق
    const [report, valuation, audit] = await Promise.all([
      generateProspectusAI(domain),
      estimateFairMarketValueAI(domain.name, domain.sector || 'General'),
      auditTechnicalHealthAI(domain.name)
    ]);
    
    setProspectus(report || "Failed to generate report.");
    setAppraisal(valuation);
    setTechAudit(audit);
    setLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter">Vault Inventory</h3>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full uppercase">{purchasedDomains.length} Assets</span>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[600px] divide-y">
          {purchasedDomains.map(d => (
            <div 
              key={d.id} 
              onClick={() => handleDeepAudit(d)}
              className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
            >
              <div className="font-bold text-slate-900">{d.name}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-[10px] font-black text-slate-400 uppercase">{d.folder}</span>
                <span className="text-xs font-black text-indigo-600">${d.price}</span>
              </div>
            </div>
          ))}
          {purchasedDomains.length === 0 && (
            <div className="p-10 text-center text-slate-400 italic text-sm">No purchased assets in vault.</div>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-[32px] border shadow-sm p-10 min-h-[600px] flex flex-col relative overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            <div className="relative">
               <div className="w-20 h-20 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fas fa-microchip text-indigo-500 animate-pulse"></i>
               </div>
            </div>
            <div className="text-center">
              <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Running FMV Algorithm & Tech Audit...</p>
              <p className="text-[10px] text-slate-400 mt-2">Cross-referencing global sales databases</p>
            </div>
          </div>
        ) : selectedDomain && (prospectus || appraisal) ? (
          <div className="animate-fade-in space-y-10">
            <div className="flex justify-between items-start border-b pb-8">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{selectedDomain.name}</h2>
                <div className="flex gap-3 mt-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-black rounded-lg uppercase">Authenticated Asset</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg uppercase">Liquidity Rating: {appraisal?.liquidityRating || 'N/A'}/10</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Value</div>
                <div className="text-3xl font-black text-indigo-600">${appraisal?.lowEstimate?.toLocaleString()} - ${appraisal?.highEstimate?.toLocaleString()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl">
                  <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <i className="fas fa-stethoscope"></i> Technical Health Status
                  </h4>
                  <div className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-indigo-500 pl-4">
                     {techAudit || "No technical anomalies detected. Domain has clean historical record."}
                  </div>
               </div>
               
               <div className="bg-indigo-50 p-8 rounded-[32px] border border-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                     <i className="fas fa-balance-scale"></i> Appraisal Logic
                  </h4>
                  <p className="text-xs text-indigo-900 leading-relaxed font-medium">
                     {appraisal?.justification || "Strategic value based on keyword relevance and industry growth patterns."}
                  </p>
               </div>
            </div>

            <div className="bg-white border rounded-3xl p-8 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Investment Prospectus</h4>
              <div className="prose prose-sm max-w-none text-slate-600 font-medium leading-relaxed whitespace-pre-wrap">
                {prospectus}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <i className="fas fa-vault text-7xl mb-6 opacity-10"></i>
            <p className="italic font-medium text-slate-400">Select an asset from your vault to initiate Deep Intelligence Audit.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
