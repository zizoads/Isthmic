
import React, { useState, useRef } from 'react';
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
  const isCancelledRef = useRef(false);
  const [marketInsights, setMarketInsights] = useState<{text: string, sources: string[]} | null>(null);
  const [secondaryMarket, setSecondaryMarket] = useState<{text: string, sources: string[]} | null>(null);

  const handleStop = () => {
    isCancelledRef.current = true;
    setIsSearching(false);
    addLog('Discovery', 'تم إلغاء عملية البحث يدوياً.', 'warning');
  };

  const handleCheckNamecheap = (domainName: string) => {
    const url = `https://www.namecheap.com/domains/registration-results/?domain=${encodeURIComponent(domainName)}`;
    window.open(url, '_blank');
  };

  const handleSearch = async () => {
    if (!keywords) return;
    isCancelledRef.current = false;
    setIsSearching(true);
    setMarketInsights(null);
    setSecondaryMarket(null);
    
    addLog('Discovery', `بدء استطلاع الميدان لقطاع: "${keywords}"...`);

    try {
      if (isCancelledRef.current) return;
      const secondaryData = await searchSecondaryMarketAI(keywords);
      if (isCancelledRef.current) return;
      setSecondaryMarket(secondaryData);
      
      const insights = await getMarketTrendsAI(keywords);
      if (isCancelledRef.current) return;
      setMarketInsights(insights);

      // طلب الأسماء مع الأسعار الحقيقية من AI
      const suggestedObjects = await brainstormDomainsAI(keywords);
      if (isCancelledRef.current) return;
      
      const newDomains: Domain[] = suggestedObjects.map((obj: any) => ({
        id: Math.random().toString(),
        name: obj.name.toLowerCase(),
        price: obj.estimatedPrice, 
        status: 'available',
        contentStatus: 'none',
        lastChecked: new Date().toISOString(),
        sector: keywords,
        justification: obj.justification,
        probability: obj.probability
      }));

      if (!isCancelledRef.current) {
        setDomains(prev => [...newDomains, ...prev]);
        addLog('Discovery', `اكتمل المسح. يمكنك الآن التحقق من الأسعار الحقيقية عبر Namecheap.`, 'success');
      }
    } catch (e) {
      addLog('Discovery', 'حدث خطأ أثناء البحث عن البيانات الحقيقية.', 'critical');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-10" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-[40px] border shadow-sm relative overflow-hidden">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase mb-2">وحدة استخبارات الميدان</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-8">نظام ربط الفرص بمحرك Namecheap المباشر</p>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="القطاع المستهدف (مثل: العقارات، الذكاء الاصطناعي)"
                className="flex-1 border-none bg-slate-100/50 rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all text-right"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
              {isSearching ? (
                <button
                  onClick={handleStop}
                  className="bg-red-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-3"
                >
                  <i className="fas fa-stop-circle"></i> إيقاف البحث
                </button>
              ) : (
                <button
                  onClick={handleSearch}
                  disabled={!keywords}
                  className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:bg-slate-300 transition-all flex items-center gap-3 shadow-xl"
                >
                  <i className="fas fa-crosshairs"></i> تشغيل المسح المدقق
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {secondaryMarket && (
              <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-xl animate-fade-in border border-slate-800">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-6 flex items-center justify-end gap-2">
                   مقارنات السوق الثانوي <i className="fas fa-shopping-bag"></i>
                </h4>
                <div className="text-xs text-slate-300 leading-relaxed italic mb-6">
                   {secondaryMarket.text.substring(0, 300)}...
                </div>
              </div>
            )}
            {marketInsights && (
               <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm animate-fade-in">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center justify-end gap-2">
                    الزخم الاستراتيجي <i className="fas fa-chart-line"></i>
                  </h4>
                  <div className="text-xs text-slate-600 leading-relaxed font-medium mb-6">
                     {marketInsights.text.substring(0, 300)}...
                  </div>
               </div>
            )}
          </div>
          
          {/* عرض النتائج المصغرة مع زر نيم شيب */}
          <div className="grid grid-cols-1 gap-4 mt-6">
            {domains.filter(d => d.sector === keywords).slice(0, 5).map(domain => (
              <div key={domain.id} className="bg-white p-6 rounded-2xl border flex justify-between items-center group hover:border-indigo-500 transition-all">
                 <button 
                  onClick={() => handleCheckNamecheap(domain.name)}
                  className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                 >
                   فحص في Namecheap
                 </button>
                 <div className="text-right">
                    <div className="font-black text-slate-800">{domain.name}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">السعر التقديري: ${domain.price}</div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 p-10 rounded-[40px] text-white flex flex-col justify-between">
           <div>
              <h4 className="text-[10px] font-black text-indigo-200 uppercase tracking-widest mb-2">تكامل مباشر</h4>
              <div className="text-5xl font-black tracking-tighter">API</div>
              <p className="mt-6 text-sm text-indigo-100 font-medium opacity-80 leading-relaxed">
                "بمجرد ظهور الفرصة، يمكنك الانتقال بضغطة واحدة إلى محرك نيم شيب الرسمي للتأكد من توافر النطاق وسعره الفوري للتسجيل."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryDashboard;
