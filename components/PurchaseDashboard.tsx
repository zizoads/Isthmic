
import React, { useState } from 'react';
import { Domain } from '../types';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const PurchaseDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [activeFolder, setActiveFolder] = useState<'All' | 'Quick Flip' | 'Long Term' | 'Premium'>('All');

  const handlePurchaseClick = (domainName: string) => {
    // فتح رابط نيم شيب في نافذة جديدة للتحقق من السعر والشراء
    const url = `https://www.namecheap.com/domains/registration-results/?domain=${encodeURIComponent(domainName)}`;
    window.open(url, '_blank');
  };

  const markAsPurchased = (id: string) => {
    setDomains(prev => prev.map(d => d.id === id ? { ...d, status: 'purchased', folder: 'Quick Flip' } : d));
  };

  const highProbability = domains.filter(d => (d.probability || 0) > 0.6 && d.status === 'available');
  const inventory = domains.filter(d => d.status === 'purchased' && (activeFolder === 'All' || d.folder === activeFolder));

  return (
    <div className="space-y-10" dir="rtl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tighter uppercase">تنفيذ الصفقات</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">اقتناص الفرص عالية الثقة</p>
        </div>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-widest">
          <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            الربط المباشر: Namecheap
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highProbability.map(domain => (
          <div key={domain.id} className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-6 hover:shadow-xl hover:border-indigo-200 transition-all group relative overflow-hidden text-right">
            <div className="flex justify-between items-start">
               <div className="text-indigo-600 font-black text-2xl tracking-tighter">$ {domain.price}</div>
               <div className="text-right">
                <h4 className="font-black text-xl text-slate-900 tracking-tight">{domain.name}</h4>
                <div className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.2em] mt-1">{domain.sector}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                <span className="text-slate-900">{(domain.probability! * 100).toFixed(0)}%</span>
                <span>مؤشر الثقة</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full" 
                  style={{ width: `${domain.probability! * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1">الربح المتوقع</div>
                  <div className="text-xs font-black text-slate-800">${domain.estimatedProfit?.toFixed(0)}</div>
               </div>
               <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div className="text-[8px] font-black text-slate-400 uppercase mb-1">حالة السيو</div>
                  <div className="text-xs font-black text-green-600">ممتاز</div>
               </div>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={() => handlePurchaseClick(domain.name)}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
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
            
            <div className="absolute top-0 left-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <i className="fas fa-crown text-amber-400 text-xs"></i>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden mt-10">
        <div className="px-10 py-8 border-b bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-inner order-2 md:order-1">
            {(['All', 'Quick Flip', 'Long Term', 'Premium'] as const).map(f => (
              <button 
                key={f}
                onClick={() => setActiveFolder(f)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeFolder === f ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="text-right order-1 md:order-2">
            <h3 className="font-black text-slate-800 uppercase tracking-tighter text-lg">المحفظة النشطة</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">إدارة الأصول وتصنيفها</p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-right text-sm">
            <thead>
              <tr className="bg-slate-50/50 border-b">
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">إجراءات</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">الحالة</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">التصنيف</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">سعر الاستحواذ</th>
                <th className="px-10 py-5 font-black text-slate-400 uppercase text-[10px] tracking-widest text-right">اسم النطاق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map(domain => (
                <tr key={domain.id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-6 text-right">
                    <button className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg opacity-0 group-hover:opacity-100 mx-auto">
                       <i className="fas fa-bullhorn text-[10px]"></i>
                    </button>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black rounded-full uppercase border border-amber-100">
                      خامل / لا توجد حملة
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <select 
                      value={domain.folder || 'Quick Flip'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, folder: val } : d));
                      }}
                      className="bg-transparent border-none text-[10px] font-black text-slate-600 uppercase focus:ring-0 cursor-pointer hover:text-indigo-600 text-right"
                    >
                      <option>Quick Flip</option>
                      <option>Long Term</option>
                      <option>Premium</option>
                    </select>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="text-sm font-black text-slate-800">${domain.price}</div>
                    <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">السعر الفوري</div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="font-black text-slate-900">{domain.name}</div>
                    <div className="text-[10px] text-indigo-500 font-bold uppercase mt-0.5">{domain.sector}</div>
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

export default PurchaseDashboard;
