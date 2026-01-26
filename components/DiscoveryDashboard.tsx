
import React, { useState } from 'react';
import { Domain } from '../types';
import { brainstormDomainsAI, getMarketTrendsAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog }) => {
  const [keywords, setKeywords] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [marketInsights, setMarketInsights] = useState<{text: string, sources: string[]} | null>(null);

  const handleSearch = async () => {
    if (!keywords) return;
    setIsSearching(true);
    setMarketInsights(null);
    
    // 1. تحليل الترندات الحقيقية عبر جوجل لزيادة الفعالية
    addLog('Discovery', `Grounding search in real-time market data for: "${keywords}"...`);
    const insights = await getMarketTrendsAI(keywords);
    setMarketInsights(insights);
    addLog('Discovery', `Market insights captured. Analyzing ROI potential...`, 'info');

    // 2. استخدام الذكاء الاصطناعي للعصف الذهني بناءً على الترندات
    const suggestedNames = await brainstormDomainsAI(keywords + " " + insights.text.substring(0, 100));
    
    // 3. محاكاة التحقق
    const newDomains: Domain[] = suggestedNames.map(name => ({
      id: Math.random().toString(),
      name: name.toLowerCase(),
      price: Math.floor(Math.random() * 5) + 10,
      status: 'available',
      contentStatus: 'none',
      lastChecked: new Date().toISOString()
    }));

    if (newDomains.length > 0) {
      addLog('Discovery', `Generated ${newDomains.length} strategic domain opportunities.`, 'success');
    } else {
      addLog('Discovery', `No relevant domains found for "${keywords}".`, 'warning');
    }

    setDomains(prev => [...newDomains, ...prev]);
    setIsSearching(false);
  };

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">Autonomous Discovery</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">AI-Powered Market Exploration & Trend Mapping</p>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <i className="fas fa-satellite absolute left-5 top-1/2 -translate-y-1/2 text-indigo-500"></i>
                <input
                  type="text"
                  placeholder="Scan for sector opportunities (e.g. Green Hydrogen)"
                  className="w-full border-none bg-slate-100/50 rounded-2xl pl-14 pr-4 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isSearching || !keywords}
                className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-300 transition-all shadow-xl shadow-slate-100 flex items-center gap-3"
              >
                {isSearching ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-radar"></i> Start Scan</>}
              </button>
            </div>
          </div>
          
          {marketInsights && (
            <div className="mt-10 p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-[10px]">
                  <i className="fas fa-globe"></i>
                </div>
                <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest">Grounding Intel</h4>
              </div>
              <p className="text-xs text-indigo-800 leading-relaxed font-medium mb-4 italic">
                {marketInsights.text.substring(0, 300)}...
              </p>
              <div className="flex flex-wrap gap-2">
                {marketInsights.sources.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-white border border-indigo-200 text-indigo-500 px-3 py-1 rounded-full font-black uppercase hover:bg-indigo-600 hover:text-white transition-all">
                    Source {i + 1}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900 p-10 rounded-[40px] text-white relative overflow-hidden">
           <div className="relative z-10">
              <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Live Analytics</h4>
              <div className="space-y-6">
                 <div>
                    <div className="text-3xl font-black">{domains.length}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase mt-1">Domains in Buffer</div>
                 </div>
                 <div className="h-[2px] bg-slate-800 w-12"></div>
                 <div className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                    "Agents are prioritized for .com liquidity and brandable brevity."
                 </div>
              </div>
           </div>
           <div className="absolute bottom-[-40px] right-[-20px] opacity-10 text-[180px] rotate-12">
              <i className="fas fa-dna"></i>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden">
        <div className="px-10 py-8 border-b flex justify-between items-center bg-slate-50/50">
          <h3 className="font-black text-slate-800 uppercase tracking-tighter">Opportunity Feed</h3>
          <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full uppercase">
            {domains.filter(d => d.status === 'available').length} High-Liquidity Leads
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b">
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Digital Asset</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Entry Price</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest">Market Integrity</th>
                <th className="px-10 py-6 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {domains.filter(d => d.status === 'available').map(domain => (
                <tr key={domain.id} className="hover:bg-indigo-50/30 transition-all group">
                  <td className="px-10 py-6 font-black text-slate-900 text-lg tracking-tight">{domain.name}</td>
                  <td className="px-10 py-6 text-indigo-600 font-black text-xl">${domain.price.toFixed(2)}</td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] font-black bg-white border px-3 py-1.5 rounded-xl text-slate-400 uppercase tracking-widest shadow-sm">
                      Unregistered
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg opacity-0 group-hover:opacity-100">
                      Deep Audit
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
