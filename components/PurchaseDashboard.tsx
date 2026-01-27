
import React, { useState } from 'react';
import { Domain } from '../types';
import { registrarInquiryAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const PurchaseDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [verifyingId, setVerifyingId] = useState<string | null>(null);

  const handleVerify = async (domain: Domain) => {
    setVerifyingId(domain.id);
    // استدعاء الـ AI الذي سيستخدم Function Calling للتحقق
    // Cast result to any because registrarInquiryAI currently returns {} in geminiServiceLegacy.ts
    const result: any = await registrarInquiryAI(domain.name);
    if (result.available) {
       setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, price: parseFloat(result.price.toString()) } : d));
    }
    setVerifyingId(null);
  };

  const handlePurchaseClick = (domainName: string) => {
    const url = `https://www.namecheap.com/domains/registration-results/?domain=${encodeURIComponent(domainName)}`;
    window.open(url, '_blank');
  };

  const markAsPurchased = (id: string) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: 'purchased', folder: 'Quick Flip' } : d));
  };

  const highProbability = domains.filter(d => (d.probability || 0) > 0.6 && d.status === 'available');

  return (
    <div className="space-y-10" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">تنفيذ الصفقات</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">اقتناص الفرص مع التحقق عبر الـ Function Calling API</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highProbability.map(domain => (
          <div key={domain.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden text-right">
            <div className="flex justify-between items-start">
               <div className="text-indigo-600 font-black text-2xl tracking-tighter">$ {domain.price}</div>
               <div className="text-right">
                <h4 className="font-black text-xl text-slate-900 tracking-tight">{domain.name}</h4>
                <div className="text-[10px] text-indigo-500 font-black uppercase mt-1">{domain.sector}</div>
              </div>
            </div>

            <button 
              onClick={() => handleVerify(domain)}
              disabled={verifyingId === domain.id}
              className="w-full bg-slate-50 text-[10px] font-black uppercase tracking-widest py-3 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
            >
              {verifyingId === domain.id ? <i className="fas fa-sync fa-spin"></i> : <><i className="fas fa-check-double"></i> استدعاء محرك السعر المباشر</>}
            </button>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handlePurchaseClick(domain.name)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-external-link-alt"></i> الشراء من Namecheap
              </button>
              <button 
                onClick={() => markAsPurchased(domain.id)}
                className="w-full bg-slate-100 text-slate-600 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all"
              >
                تم الشراء؟ انقله للمحفظة
              </button>
            </div>
          </div>
        ))}
        {highProbability.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-20 flex flex-col items-center">
            <i className="fas fa-shopping-cart text-6xl mb-4"></i>
            <p className="font-black uppercase tracking-widest">لا توجد صفقات عالية الموثوقية بانتظار التنفيذ حالياً.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseDashboard;
