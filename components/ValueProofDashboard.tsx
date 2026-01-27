
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
    <div className="space-y-8 animate-fade-in" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Side */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 rounded-[32px] border dark:border-white/5 shadow-sm flex flex-col h-[750px]">
          <div className="p-6 border-b dark:border-white/5 bg-slate-50/50 dark:bg-white/2">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
               {lang === 'ar' ? 'الأصول الجاهزة للتوليد' : 'Assets Ready for Synthesis'}
             </h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y dark:divide-white/5 scrollbar-hide">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleGenerateProof(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 ${selectedDomain?.id === d.id ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500' : ''} ${lang === 'ar' ? 'text-right border-r-4' : 'text-left border-l-4'}`}
              >
                <div className="font-bold text-slate-900 dark:text-white text-sm">{d.name}</div>
                <div className="text-[9px] text-indigo-500 font-black uppercase mt-1">
                  {lang === 'ar' ? 'توليد إثبات القيمة' : 'Synthesize Artifact'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Proofing View */}
        <div className="lg:col-span-3 min-h-[750px] relative">
          {isLoading ? (
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border dark:border-white/5 h-full flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest animate-pulse">
                    {lang === 'ar' ? `جاري بناء الرؤية لـ ${selectedDomain?.name}...` : `Dreaming Big for ${selectedDomain?.name}...`}
                  </p>
               </div>
            </div>
          ) : valueProof ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
              
              {/* Concept & Vision */}
              <div className="space-y-8">
                <div className="bg-[#0b0e14] text-white p-10 rounded-[40px] shadow-2xl relative overflow-hidden border border-white/5">
                   <div className="relative z-10">
                      <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">
                        {lang === 'ar' ? 'الفكرة الكبرى' : 'The Big Idea'}
                      </h4>
                      <p className="text-xl font-black text-white leading-tight mb-8">
                        {valueProof.bigIdea}
                      </p>
                      <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                          {valueProof.visualIdentity.colors.map((c: string, i: number) => (
                            <div key={i} className="w-10 h-10 rounded-full border-4 border-[#0b0e14] shadow-xl" style={{ backgroundColor: c }}></div>
                          ))}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase">Brand Palette</div>
                      </div>
                   </div>
                   <i className="fas fa-lightbulb absolute right-[-20px] top-[-20px] text-white/5 text-[150px]"></i>
                </div>

                <div className="bg-white dark:bg-slate-900 p-10 rounded-[40px] border dark:border-white/5 shadow-sm">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">
                     {lang === 'ar' ? 'الجمالية البصرية' : 'Visual Aesthetic'}
                   </h4>
                   <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic border-indigo-100 pr-6 border-r-4">
                      "{valueProof.visualIdentity.aesthetic}"
                   </p>
                </div>

                <div className="bg-indigo-600 p-8 rounded-[40px] text-white flex justify-between items-center shadow-xl">
                   <div>
                      <div className="text-[10px] font-black uppercase text-indigo-200">{lang === 'ar' ? 'درجة الابتكار' : 'Disruption Score'}</div>
                      <div className="text-4xl font-black">{valueProof.disruptionScore}%</div>
                   </div>
                   <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 text-2xl">
                      <i className="fas fa-bolt"></i>
                   </div>
                </div>
              </div>

              {/* LIVE ARTIFACT VIEWER */}
              <div className="relative h-full">
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
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border dark:border-white/5 h-full flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-wand-magic-sparkles text-7xl mb-6 opacity-10"></i>
               <p className="italic text-sm">
                 {lang === 'ar' ? 'اختر أصلاً لتوليد إثبات القيمة التفاعلي.' : 'Select an asset to generate an Interactive Value Proof.'}
               </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ValueProofDashboard;
