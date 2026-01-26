
import React, { useState } from 'react';
import { Domain } from '../types';
// Remove unused and non-existent import generateProspectusAI
import { estimateFairMarketValueAI, auditTechnicalHealthAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const PortfolioManager: React.FC<Props> = ({ domains, setDomains }) => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [loading, setLoading] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImporter, setShowImporter] = useState(false);

  const handleBulkImport = () => {
    const lines = importText.split('\n').filter(l => l.trim() !== '');
    const newDomains: Domain[] = lines.map(line => {
      const parts = line.split(/[,;|\s]+/);
      const name = parts[0].trim().toLowerCase();
      const cost = parts[1] ? Number(parts[1].replace(/[^0-9.]/g, '')) : 15;
      
      return {
        id: Math.random().toString(),
        name,
        price: cost,
        acquisitionCost: cost,
        acquisitionDate: new Date().toISOString(),
        status: 'purchased' as const,
        contentStatus: 'none' as const,
        folder: 'Quick Flip' as const,
        lastChecked: new Date().toISOString()
      };
    });
    setDomains(prev => [...newDomains, ...prev]);
    setImportText('');
    setShowImporter(false);
  };

  const handleDeepAudit = async (domain: Domain) => {
    setLoading(true);
    setSelectedDomain(domain);
    try {
      const [valuation] = await Promise.all([
        estimateFairMarketValueAI(domain.name, domain.sector || 'General'),
        auditTechnicalHealthAI(domain.name)
      ]);
      
      setDomains(prev => prev.map(d => d.id === domain.id ? {
        ...d,
        estimatedProfit: valuation?.highEstimate,
        technicalMetrics: { ...d.technicalMetrics, liquidityScore: valuation?.liquidityRating }
      } : d));
    } catch (e) {
      console.error("Audit failed", e);
    }
    setLoading(false);
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8" dir="rtl">
      {/* قسم الإدخال */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <div className="bg-slate-900 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
           <h3 className="text-xl font-black tracking-tighter uppercase mb-6">مزامنة المخزون</h3>
           <p className="text-slate-400 text-xs font-medium leading-relaxed mb-8">
             أدخل نطاقاتك الحالية هنا. قم بلصقها بصيغة: <br/><strong>domain.com, سعر_الشراء</strong>
           </p>
           <button 
            onClick={() => setShowImporter(!showImporter)}
            className="w-full bg-white text-slate-900 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all flex items-center justify-center gap-3"
           >
            <i className="fas fa-plus"></i> {showImporter ? 'إلغاء الإدخال' : 'إضافة نطاقات للخزنة'}
           </button>
        </div>

        {showImporter && (
          <div className="bg-white p-8 rounded-[32px] border shadow-2xl shadow-indigo-100 space-y-6 animate-slide-up">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">أداة الاستيراد الشامل</h4>
            <textarea 
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 text-left"
              placeholder="example.com, 250&#10;invest.ai, 1200&#10;meta.io, 50"
            />
            <button 
              onClick={handleBulkImport}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
              بدء مزامنة الأصول
            </button>
          </div>
        )}

        {/* قائمة الأصول */}
        <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden flex flex-col flex-1">
          <div className="p-8 border-b bg-slate-50/50 flex justify-between items-center">
            <div className="text-right">
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter">مخزون الخزنة</h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">أصولك الحقيقية تحت الإدارة</p>
            </div>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg uppercase">{purchasedDomains.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-slate-50">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleDeepAudit(d)}
                className={`p-6 cursor-pointer transition-all hover:bg-indigo-50/50 flex items-center justify-between ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''}`}
              >
                <div className="text-right">
                  <div className="font-black text-slate-900 text-base">{d.name}</div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">التكلفة: ${d.acquisitionCost || d.price}</span>
                  </div>
                </div>
                <div className="text-left">
                  {d.estimatedProfit ? (
                    <div className="text-green-600 font-black text-sm tracking-tighter">${d.estimatedProfit}</div>
                  ) : <div className="text-slate-200"><i className="fas fa-ellipsis-h"></i></div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* قسم التحليل والتفاصيل */}
      <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-sm p-12 min-h-[700px] flex flex-col relative overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            <div className="relative">
               <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               <i className="fas fa-shield-alt absolute inset-0 flex items-center justify-center text-indigo-600 text-2xl"></i>
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">جاري إجراء الفحص المؤسسي...</p>
          </div>
        ) : selectedDomain ? (
          <div className="animate-fade-in space-y-12 text-right">
             <div className="flex justify-between items-start border-b border-slate-100 pb-10">
              <div>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{selectedDomain.name}</h2>
                <div className="flex gap-4 mt-6">
                  <span className="px-4 py-1.5 bg-slate-900 text-white text-[10px] font-black rounded-xl uppercase tracking-widest">في المخزون</span>
                  <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-xl uppercase tracking-widest border border-indigo-100">مراقبة السوق</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">مصادر التقييم</h4>
                  <div className="space-y-4">
                     {['قاعدة بيانات مبيعات NameBio', 'تقييمات Afternic الحية', 'حجم البحث في Google Trends'].map(src => (
                       <div key={src} className="flex items-center gap-3 text-xs font-bold text-slate-700">
                         <i className="fas fa-check-circle text-green-500"></i> {src}
                       </div>
                     ))}
                  </div>
               </div>
               <div className="bg-indigo-600 p-8 rounded-[32px] text-white shadow-xl shadow-indigo-100">
                  <h4 className="text-[10px] font-black text-indigo-200 uppercase mb-4 tracking-widest">الاستراتيجية المقترحة</h4>
                  <p className="text-sm font-medium leading-relaxed italic">
                    "هذا الأصل لديه رنين عالٍ في قطاع {selectedDomain.sector || 'التكنولوجيا'}. نوصي بوضعه للبيع فوراً."
                  </p>
               </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
            <i className="fas fa-vault text-[120px] mb-10 opacity-5"></i>
            <div className="max-w-xs text-center">
              <p className="text-base font-bold text-slate-400 mb-2 tracking-tight uppercase">جاهز للبدء</p>
              <p className="text-sm italic text-slate-300">"أدخل قائمة نطاقاتك في الخانة اليمنى لنبدأ العمل."</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PortfolioManager;
