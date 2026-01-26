
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateValueProofAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
}

const ValueProofDashboard: React.FC<Props> = ({ domains }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [valueProof, setValueProof] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateProof = async (domain: Domain) => {
    setIsLoading(true);
    setSelectedDomain(domain);
    const proof = await generateValueProofAI(domain.name, domain.sector || 'Technology');
    setValueProof(proof);
    setIsLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Side */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm flex flex-col h-[750px]">
          <div className="p-6 border-b bg-slate-50/50">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Select Asset to Proof</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleGenerateProof(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-slate-900 text-sm">{d.name}</div>
                <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">Proof Value Concept</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Proofing View */}
        <div className="lg:col-span-3 min-h-[750px] relative">
          {isLoading ? (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="text-center">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Dreaming Big for {selectedDomain?.name}...</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-2">Generating business logic and visual identity</p>
               </div>
            </div>
          ) : valueProof ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              
              {/* Concept & Vision */}
              <div className="space-y-8">
                <div className="bg-slate-900 text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">The Big Idea</h4>
                      <p className="text-xl font-black text-white leading-tight mb-8">
                        {valueProof.bigIdea}
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                          {valueProof.visualIdentity.colors.map((c: string, i: number) => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-slate-900 shadow-xl" style={{ backgroundColor: c }}></div>
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Brand Palette</div>
                      </div>
                   </div>
                   <i className="fas fa-lightbulb absolute right-[-20px] top-[-20px] text-white/5 text-[150px]"></i>
                </div>

                <div className="bg-white p-10 rounded-[40px] border shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Visual Aesthetic</h4>
                   <p className="text-sm text-slate-600 font-medium leading-relaxed italic border-l-4 border-indigo-100 pl-6">
                      "{valueProof.visualIdentity.aesthetic}"
                   </p>
                   <div className="mt-8 p-6 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-2">Logo Concept</div>
                      <p className="text-xs text-slate-800 font-bold">{valueProof.visualIdentity.logoConcept}</p>
                   </div>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[40px] text-white flex justify-between items-center">
                   <div>
                      <div className="text-[10px] font-black uppercase text-indigo-200">Disruption Score</div>
                      <div className="text-4xl font-black">{valueProof.disruptionScore}%</div>
                   </div>
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                      <i className="fas fa-bolt text-2xl"></i>
                   </div>
                </div>
              </div>

              {/* Landing Page Blueprint */}
              <div className="bg-white rounded-[40px] border shadow-xl flex flex-col overflow-hidden">
                 <div className="p-4 bg-slate-100 border-b flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <div className="flex-1 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">{selectedDomain?.name} Preview</div>
                 </div>
                 
                 <div className="flex-1 p-10 flex flex-col items-center justify-center text-center space-y-8">
                    <div className="space-y-4">
                       <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">{valueProof.landingPage.headline}</h1>
                       <p className="text-sm text-slate-500 font-medium max-w-sm mx-auto">{valueProof.landingPage.subheadline}</p>
                    </div>

                    <div className="w-full space-y-4">
                       {valueProof.landingPage.features.map((f: string, i: number) => (
                         <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4 text-left group hover:border-indigo-200 transition-all">
                            <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-indigo-500 text-xs font-black">{i+1}</div>
                            <span className="text-xs font-black text-slate-700">{f}</span>
                         </div>
                       ))}
                    </div>

                    <button className="w-full py-5 bg-indigo-600 text-white rounded-[24px] text-sm font-black uppercase tracking-widest shadow-2xl shadow-indigo-200 hover:scale-[1.02] transition-all">
                       {valueProof.landingPage.cta}
                    </button>
                 </div>
                 
                 <div className="p-6 bg-slate-50 border-t flex justify-center gap-6">
                    <button className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-colors flex items-center gap-2">
                       <i className="fas fa-file-export"></i> Export Deck
                    </button>
                    <button className="text-[10px] font-black text-slate-400 uppercase hover:text-indigo-600 transition-colors flex items-center gap-2">
                       <i className="fas fa-paper-plane"></i> Attach to Pitch
                    </button>
                 </div>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-[40px] border h-full flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-paint-brush text-7xl mb-6 opacity-10"></i>
               <p className="italic text-sm">Select an asset to generate a compelling "Value Proof" concept.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ValueProofDashboard;
