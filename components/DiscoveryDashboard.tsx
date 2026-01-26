
import React, { useState, useRef } from 'react';
import { Domain, ThinkingStep } from '../types';
import { rigorousDiscoveryAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  addLog: (agent: string, message: string, type?: 'info' | 'success' | 'warning' | 'critical') => void;
}

const DiscoveryDashboard: React.FC<Props> = ({ domains, setDomains, addLog }) => {
  const [prompt, setPrompt] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const isCancelledRef = useRef(false);
  const [scannedResults, setScannedResults] = useState<any[]>([]);
  const [discoverySteps, setDiscoverySteps] = useState<ThinkingStep[]>([]);

  const handleSearch = async () => {
    if (!prompt) return;
    isCancelledRef.current = false;
    setIsSearching(true);
    setScannedResults([]);
    setDiscoverySteps([
      { id: '1', action: 'Deep Sourcing', finding: 'Scanning Afternic & Dan inventories...', status: 'searching' },
      { id: '2', action: 'Liquidity Check', finding: 'Retrieving 24-month comp sales...', status: 'pending' },
      { id: '3', action: 'History Audit', finding: 'Analyzing Archive.org fingerprints...', status: 'pending' }
    ]);
    
    addLog('Sniper Engine', `بدء عملية القنص المعمقة للنطاق: "${prompt}"`);

    try {
      const results = await rigorousDiscoveryAI(prompt);
      
      if (isCancelledRef.current) return;

      setDiscoverySteps(prev => prev.map(s => ({ ...s, status: 'complete' as const })));
      setScannedResults(results);
      addLog('Sniper Engine', `تم العثور على ${results.length} فرصة استثمارية تم التحقق منها سوقياً.`, 'success');

    } catch (e) {
      addLog('Sniper Engine', 'فشل في الاتصال بمحرك البحث الأرضي.', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  const addAllToPipeline = () => {
    const formatted = scannedResults.map(r => ({
      id: Math.random().toString(),
      name: r.name,
      price: r.estimatedPrice,
      status: 'available' as const,
      contentStatus: 'none' as const,
      lastChecked: new Date().toISOString(),
      sector: r.justification.split(' ')[0],
      justification: r.justification,
      probability: r.probability,
      technicalMetrics: {
        liquidityScore: Math.round(r.probability * 100),
        historyYears: r.marketData?.historyStatus === 'Clean' ? 10 : 0
      }
    }));
    setDomains(prev => [...formatted, ...prev]);
    setScannedResults([]);
    addLog('System', 'تم تحويل الفرص المختارة إلى خط التدقيق الشامل.', 'success');
  };

  return (
    <div className="space-y-10 animate-fade-in" dir="rtl">
      <div className="bg-[#0b0e14] p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-900/40">
                <i className="fas fa-crosshairs"></i>
             </div>
             <div>
                <h3 className="text-3xl font-black tracking-tighter uppercase">قناص النطاقات الاستراتيجي (Strategic Sniper)</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">المستشار يبحث الآن في NameBio، الأرشيف، وسوق Afternic الحقيقي.</p>
             </div>
          </div>
          
          <div className="space-y-6">
            <textarea
              placeholder="مثال: ابحث عن نطاقات قصيرة لشركات التكنولوجيا المالية تحت 500 دولار، تأكد من نظافة التاريخ ووجود مبيعات مشابهة فوق 2000 دولار..."
              className="w-full bg-white/5 border border-white/10 rounded-[32px] px-8 py-6 text-sm font-medium focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all h-32 text-right placeholder:text-slate-600"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-between items-center">
               <div className="flex gap-6">
                  {discoverySteps.map(step => (
                    <div key={step.id} className="flex items-center gap-3">
                       <div className={`w-3 h-3 rounded-full ${
                         step.status === 'complete' ? 'bg-green-500' : 
                         step.status === 'searching' ? 'bg-amber-500 animate-pulse' : 'bg-slate-700'
                       }`}></div>
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{step.action}</span>
                    </div>
                  ))}
               </div>
               <div className="flex gap-4">
                  {isSearching ? (
                    <button onClick={() => isCancelledRef.current = true} className="bg-red-500 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-600 transition-all">
                      إلغاء العملية
                    </button>
                  ) : (
                    <button onClick={handleSearch} disabled={!prompt} className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white hover:text-indigo-600 transition-all shadow-2xl disabled:opacity-20">
                      إطلاق رادار البحث والتحقق
                    </button>
                  )}
               </div>
            </div>
          </div>
        </div>
        <i className="fas fa-satellite absolute left-[-40px] bottom-[-40px] text-white/5 text-[300px]"></i>
      </div>

      {scannedResults.length > 0 && (
        <div className="bg-white p-10 rounded-[40px] border shadow-sm animate-slide-up border-slate-100">
          <div className="flex justify-between items-center mb-8 border-b border-slate-50 pb-6">
            <button onClick={addAllToPipeline} className="bg-slate-900 text-white px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all">
               حقن الفرص في خط الإنتاج
            </button>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">فرص ذهبية تم التحقق منها</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {scannedResults.map((r, i) => (
              <div key={i} className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 hover:border-indigo-300 transition-all text-right group relative overflow-hidden">
                <div className="flex justify-between items-start mb-6">
                  <div className="text-2xl font-black text-indigo-600">${r.estimatedPrice}</div>
                  <div className="font-black text-slate-900 text-xl">{r.name}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="bg-white p-4 rounded-2xl border text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">السيولة</div>
                      <div className="text-xs font-black text-indigo-600">{(r.probability * 100).toFixed(0)}%</div>
                   </div>
                   <div className="bg-white p-4 rounded-2xl border text-center">
                      <div className="text-[8px] font-black text-slate-400 uppercase mb-1">التاريخ</div>
                      <div className={`text-xs font-black ${r.verifiedMetrics.historyClean ? 'text-green-600' : 'text-amber-500'}`}>
                        {r.verifiedMetrics.historyClean ? 'نظيف' : 'مجهول'}
                      </div>
                   </div>
                </div>

                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 mb-6">
                   <div className="text-[8px] font-black text-indigo-400 uppercase mb-1">مبيعات مشابهة</div>
                   <div className="text-[10px] font-bold text-slate-700">{r.marketData?.comparableSale || 'N/A'}</div>
                </div>

                <p className="text-xs text-slate-500 italic leading-relaxed mb-6">"{r.justification}"</p>
                
                <div className="pt-4 border-t flex justify-between items-center">
                   <div className="flex gap-2">
                      <i className="fas fa-shield-check text-green-500 text-xs"></i>
                      <i className="fas fa-search-dollar text-indigo-400 text-xs"></i>
                   </div>
                   <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">تم التحقق عبر الذكاء الاصطناعي</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryDashboard;
