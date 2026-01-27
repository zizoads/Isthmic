
import React, { useState } from 'react';
import { Domain } from '../types';
import { generateValueProofAI } from '../services/geminiService';
import ArtifactViewer from './ArtifactViewer';

interface Props {
  domains: Domain[];
  lang: 'ar' | 'en';
}

const ValueProofDashboard: React.FC<Props> = ({ domains, lang }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [valueProof, setValueProof] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateProof = async (domain: Domain) => {
    setIsLoading(true);
    setSelectedDomain(domain);
    try {
      const proof = await generateValueProofAI(domain.name, domain.sector || 'Technology');
      setValueProof(proof);
    } catch (e) {
      console.error(e);
    }
    setIsLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased' || d.status === 'available');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Asset List Side */}
      <div className="lg:col-span-1 bg-[#08090d] border border-white/5 rounded-2xl flex flex-col h-[650px] overflow-hidden">
        <div className="p-4 border-b border-white/5 bg-white/2">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {lang === 'ar' ? 'الأصول الجاهزة' : 'Ready Assets'}
           </h3>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide divide-y divide-white/5">
          {purchasedDomains.map(d => {
            const isActive = selectedDomain?.id === d.id;
            return (
              <div 
                key={d.id} 
                onClick={() => handleGenerateProof(d)}
                className={`p-4 cursor-pointer transition-all ${isActive ? 'bg-indigo-600/20 border-r-2 border-indigo-500' : 'hover:bg-white/5'}`}
              >
                <div className="font-bold text-white text-xs">{d.name}</div>
                <div className="text-[9px] text-indigo-500 font-black uppercase mt-1">
                  {lang === 'ar' ? 'توليد الإثبات' : 'Synthesize Proof'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Proofing Workspace */}
      <div className="lg:col-span-3 min-h-[650px] bg-[#08090d] border border-white/5 rounded-3xl p-8 relative overflow-hidden">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
             <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest animate-pulse">
               Architecting Value for {selectedDomain?.name}...
             </p>
          </div>
        ) : valueProof ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 h-full overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
                 <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-4">The Big Idea</h4>
                 <p className="text-lg font-bold text-white leading-tight">{valueProof.bigIdea}</p>
              </div>
              <div className="p-6 bg-white/2 border border-white/5 rounded-2xl">
                 <h4 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4">Landing Structure</h4>
                 <div className="space-y-2">
                    {valueProof.landingPage.features.map((f: string, i: number) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-center gap-2">
                         <i className="fas fa-check text-green-500 text-[8px]"></i> {f}
                      </div>
                    ))}
                 </div>
              </div>
            </div>
            <div className="h-full">
              <ArtifactViewer 
                domainName={selectedDomain?.name || ''}
                lang={lang}
                data={{
                  headline: valueProof.landingPage.headline,
                  subheadline: valueProof.landingPage.subheadline,
                  features: valueProof.landingPage.features,
                  cta: valueProof.landingPage.cta,
                  primaryColor: valueProof.visualIdentity.colors[0] || '#6366f1',
                  accentColor: valueProof.visualIdentity.colors[1] || '#4f46e5',
                  layoutType: 'modern'
                }}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-700">
             <i className="fas fa-wand-sparkles text-6xl mb-4"></i>
             <p className="text-[10px] font-black uppercase tracking-[0.3em]">Select asset to generate Artifact</p>
          </div>
        )}
        <i className="fas fa-signature absolute right-[-20px] bottom-[-20px] text-white/2 text-[150px] pointer-events-none"></i>
      </div>
    </div>
  );
};

export default ValueProofDashboard;
