
import React, { useState } from 'react';
import { Domain } from '../types';
import { brainstormDomainsAI, getMarketTrendsAI, searchSecondaryMarketAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog }) => {
  const [keywords, setKeywords] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [marketInsights, setMarketInsights] = useState<{text: string, sources: string[]} | null>(null);
  const [secondaryMarket, setSecondaryMarket] = useState<{text: string, sources: string[]} | null>(null);

  const handleSearch = async () => {
    if (!keywords) return;
    setIsSearching(true);
    setMarketInsights(null);
    setSecondaryMarket(null);
    
    addLog('Discovery', `Initiating Field Reconnaissance for: "${keywords}"...`);

    // 1. مسح السوق الثانوي (المنافسة والفرص الحقيقية)
    const secondaryData = await searchSecondaryMarketAI(keywords);
    setSecondaryMarket(secondaryData);
    addLog('Discovery', `Secondary market scan complete. Identifying liquid gaps...`, 'info');

    // 2. تحليل الترندات
    const insights = await getMarketTrendsAI(keywords);
    setMarketInsights(insights);

    // 3. توليد الفرص بناءً على البيانات الواقعية
    const suggestedNames = await brainstormDomainsAI(keywords + " " + insights.text.substring(0, 50));
    
    const newDomains: Domain[] = suggestedNames.map(name => ({
      id: Math.random().toString(),
      name: name.toLowerCase(),
      price: Math.floor(Math.random() * 20) + 10,
      status: 'available',
      contentStatus: 'none',
      lastChecked: new Date().toISOString(),
      sector: keywords
    }));

    setDomains(prev => [...newDomains, ...prev]);
    setIsSearching(false);
    addLog('Discovery', `Field Scan Finished. ${newDomains.length} strategic assets identified.`, 'success');
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border shadow-sm relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">Field Intelligence Unit</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">Grounding AI suggestions in real-world liquidity data</p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Sector focus (e.g. AI Agents, Fintech, VR)"
                className="flex-1 border-none bg-slate-100/50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !keywords}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-300 transition-all flex items-center gap-3"
              >
                {isSearching ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-crosshairs"></i> Run Tactical Scan</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryMarket && (
              <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl animate-fade-in border border-slate-800">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <i className="fas fa-shopping-bag"></i> Secondary Market Comps
                </h4>
                <div className="text-xs text-slate-300 leading-relaxed italic mb-6">
                   {secondaryMarket.text.substring(0, 300)}...
                </div>
                <div className="flex flex-wrap gap-2">
                  {secondaryMarket.sources.slice(0, 3).map((s, i) => (
                    <a key={i} href={s} target="_blank" className="text-[9px] font-black text-indigo-400 uppercase hover:underline">Link {i+1}</a>
                  ))}
                </div>
              </div>
            )}
            {marketInsights && (
               <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-fade-in">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                    <i className="fas fa-chart-line"></i> Strategic Momentum
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
                     {marketInsights.text.substring(0, 300)}...
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                     <div className="w-3/4 h-full bg-indigo-500"></div>
                  </div>
               </div>
            )}
          </div>
        </div>

        <div className="bg-indigo-600 p-10 rounded-[40px] text-white flex flex-col justify-between">
           <div>
              <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">Portfolio Readiness</h4>
              <div className="text-5xl font-black tracking-tighter">Ready</div>
              <p className="mt-6 text-sm text-indigo-100 font-medium opacity-80 leading-relaxed">
                "Field agents are deployed. Currently mapping the secondary market for high-alpha entry points."
              </p>
           </div>
           <div className="mt-10 pt-10 border-t border-indigo-500/50">
              <div className="flex justify-between items-center text-[10px] font-black uppercase">
                 <span>Active Scans</span>
                 <span>4 Nodes</span>
              </div>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter">Tactical Opportunity Buffer</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sector</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.filter(d => d.status === 'available').map(domain => (
                <tr key={domain.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-6 font-black text-slate-900 text-lg">{domain.name}</td>
                  <td className="px-10 py-6 font-bold text-indigo-600 uppercase text-xs">{domain.sector}</td>
                  <td className="px-10 py-6 text-right">
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                      Run Risk Audit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryDashboard;
