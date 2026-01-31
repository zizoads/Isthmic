import React, { useState } from 'react';
import { Domain, PlatformStats, ReportSection } from '../types';
import { ReportService } from '../services/ReportService';
import { generateExecutiveReportAI } from '../services/geminiService';

interface Props {
  stats: PlatformStats;
  domains: Domain[];
  lang: 'ar' | 'en';
}

const SovereignReportBuilder: React.FC<Props> = ({ stats, domains, lang }) => {
  const [selectedSections, setSelectedSections] = useState<string[]>(['financials', 'assets']);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [narrative, setNarrative] = useState<string | null>(null);

  const toggleSection = (id: string) => {
    setSelectedSections(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSynthesize = async () => {
    setIsSynthesizing(true);
    // Fix: Explicitly typing the Set and Array.from result to ensure sectors is string[] and not unknown[].
    const sectors: string[] = Array.from(new Set<string>(domains.map(d => d.sector || 'Uncategorized')));
    const report = await generateExecutiveReportAI(stats, sectors);
    setNarrative(report.summary);
    setIsSynthesizing(false);
  };

  return (
    <div className="space-y-12 animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <header className="flex flex-col md:flex-row justify-between items-end gap-8 border-b-2 border-white/10 pb-10">
        <div className="space-y-2">
           <span className="text-[10px] font-black text-[#c5a059] uppercase tracking-[0.5em]">Reporting Protocol v4.0</span>
           <h2 className="text-4xl lg:text-6xl prestige-title text-white italic">Intelligence Briefing Assembler</h2>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleSynthesize}
             className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
           >
             {isSynthesizing ? <i className="fas fa-cog fa-spin"></i> : <i className="fas fa-brain"></i>}
             <span className="ml-3">{lang === 'ar' ? 'توليد السرد الذكي' : 'Synthesize Narrative'}</span>
           </button>
           <button 
             onClick={() => ReportService.printDossier()}
             className="px-8 py-4 bg-[#c5a059] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl"
           >
             <i className="fas fa-file-export mr-2"></i> {lang === 'ar' ? 'تصدير الملف' : 'Export Dossier'}
           </button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-10">
        {/* Selection Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Dossier Composition</h3>
           <div className="space-y-3">
              {[
                { id: 'financials', label: 'Financial Ledger', desc: 'Net equity, ROI metrics, and liquidity pulse.' },
                { id: 'assets', label: 'Asset Inventory', desc: 'Full registry of secured and available units.' },
                { id: 'forensics', label: 'Forensic DNA Audit', desc: 'Integrity scores and security investigation logs.' }
              ].map(sec => (
                <button 
                  key={sec.id}
                  onClick={() => toggleSection(sec.id)}
                  className={`w-full p-6 rounded-3xl border text-left transition-all group
                    ${selectedSections.includes(sec.id) ? 'bg-[#c5a059]/10 border-[#c5a059] text-white' : 'bg-white/2 border-white/5 text-slate-500 hover:border-white/20'}`}
                >
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-sm font-black uppercase">{sec.label}</span>
                     <div className={`w-4 h-4 rounded-full border-2 transition-all ${selectedSections.includes(sec.id) ? 'bg-[#c5a059] border-[#c5a059]' : 'border-slate-700'}`}></div>
                  </div>
                  <p className="text-[10px] italic leading-relaxed opacity-60">{sec.desc}</p>
                </button>
              ))}
           </div>
        </div>

        {/* Live Preview / Dossier Mockup */}
        <div className="col-span-12 lg:col-span-8 bg-white text-black p-10 lg:p-20 rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] dossier-print">
           <div className="border-2 border-black p-12 space-y-12 min-h-[800px] relative overflow-hidden">
              <header className="flex justify-between items-start border-b-2 border-black pb-8">
                 <div>
                    <h1 className="text-5xl font-black italic prestige-title leading-none">Isthmic Briefing.</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest mt-2">Protocol: Sovereign_Disclosure</p>
                 </div>
                 <div className="text-right font-mono text-[9px] uppercase">
                    <div>Ref: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
                    <div>Date: {new Date().toLocaleDateString()}</div>
                 </div>
              </header>

              {narrative && (
                <section className="animate-precision">
                   <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-4 underline">Executive Narrative</h4>
                   <p className="text-2xl font-light leading-relaxed italic">"{narrative}"</p>
                </section>
              )}

              <div className="space-y-12">
                 {selectedSections.includes('financials') && (
                    <div className="animate-slide-up">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 underline">Financial Exposure</h4>
                       <div className="grid grid-cols-2 gap-8">
                          <div className="border-l-2 border-black pl-4">
                             <div className="text-[8px] font-black uppercase text-slate-500">Estimated Portfolio Value</div>
                             <div className="text-3xl font-black">${stats.estimatedPortfolioValue.toLocaleString()}</div>
                          </div>
                          <div className="border-l-2 border-black pl-4">
                             <div className="text-[8px] font-black uppercase text-slate-500">Average Alpha Margin</div>
                             <div className="text-3xl font-black">{stats.avgProfit}%</div>
                          </div>
                       </div>
                    </div>
                 )}

                 {selectedSections.includes('assets') && (
                    <div className="animate-slide-up">
                       <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 underline">Strategic Units Registry</h4>
                       <table className="w-full text-left font-mono text-[10px]">
                          <thead>
                             <tr className="border-b border-black/20">
                                <th className="pb-2">UNIT_ID</th>
                                <th className="pb-2">SECTOR</th>
                                <th className="pb-2 text-right">VALUATION</th>
                             </tr>
                          </thead>
                          <tbody>
                             {domains.slice(0, 5).map((d, i) => (
                               <tr key={i} className="border-b border-black/5">
                                  <td className="py-2 font-black">{d.name}</td>
                                  <td className="py-2 italic">{d.sector}</td>
                                  <td className="py-2 text-right font-black">${d.price}</td>
                               </tr>
                             ))}
                          </tbody>
                       </table>
                       {domains.length > 5 && <div className="text-[8px] mt-2 opacity-50 italic">+ {domains.length - 5} additional units secured in vault.</div>}
                    </div>
                 )}
              </div>

              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-12">
                 <div className="text-[200px] font-black uppercase tracking-[0.5em]">CLASSIFIED</div>
              </div>
              
              <footer className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-black/10 pt-8">
                 <div className="text-[8px] font-bold uppercase opacity-30">Isthmic Pro // Sovereign Command Post</div>
                 <div className="w-20 h-20 border border-black/20 flex items-center justify-center p-2 opacity-20">
                    <i className="fas fa-fingerprint text-4xl"></i>
                 </div>
              </footer>
           </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          .dossier-print, .dossier-print * { visibility: visible; }
          .dossier-print { position: absolute; left: 0; top: 0; width: 100%; background: white !important; padding: 0 !important; margin: 0 !important; }
        }
      `}</style>
    </div>
  );
};

export default SovereignReportBuilder;