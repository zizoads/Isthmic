
import React, { useState } from 'react';
import { ServiceIntegration } from '../types';

interface Props {
  integrations: ServiceIntegration[];
  onConnect: (id: string, key: string) => void;
}

const IntegrationCenter: React.FC<Props> = ({ integrations, onConnect }) => {
  const [activeKeyInput, setActiveKeyInput] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');

  // قائمة الأدوات الاستراتيجية لتعزيز قوة القناص
  const strategicTools = [
    { id: 'nb-1', name: 'NameBio Premium', provider: 'namebio', impact: 'دقة تسعير النطاق بناءً على مبيعات تاريخية حقيقية.', icon: 'fa-history' },
    { id: 'hi-1', name: 'Hunter Intelligence', provider: 'hunter', impact: 'استخراج البريد المباشر للمديرين التنفيذيين للتسويق.', icon: 'fa-envelope-open-text' },
    { id: 'mz-1', name: 'Moz SEO Pro', provider: 'moz', impact: 'قياس قوة النطاق التقنية (DA) وجاذبيته لمحركات البحث.', icon: 'fa-chart-line' },
    { id: 'tr-1', name: 'Trademark Watch', provider: 'wipo', impact: 'حماية استثمارك من قضايا العلامات التجارية الدولية.', icon: 'fa-gavel' },
    { id: 'es-1', name: 'Escrow Secure', provider: 'escrow', impact: 'تأمين تحويل الأموال والملكية في الصفقات الكبرى.', icon: 'fa-shield-halved' }
  ];

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="bg-[#0b0e14] rounded-[40px] p-12 text-white shadow-2xl relative overflow-hidden border border-white/5">
        <div className="relative z-10 max-w-3xl">
          <h3 className="text-4xl font-black tracking-tighter uppercase mb-6">ترسانة الأدوات الاستراتيجية</h3>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            للحصول على أداء <span className="text-indigo-400">"القناص"</span>، يجب تزويد المستشار بمفاتيح الوصول لهذه المنصات. 
            في حال غياب أي مفتاح، سينتقل المستشار تلقائياً إلى وضع <span className="text-amber-500">"الاستدلال التقديري"</span> لتعويض النقص عبر البحث المتقدم.
          </p>
        </div>
        <i className="fas fa-microchip absolute left-[-40px] top-[-40px] text-white/5 text-[280px]"></i>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {strategicTools.map((tool) => {
          const isConnected = integrations.find(i => i.provider === tool.provider)?.status === 'connected';
          return (
            <div key={tool.id} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group flex flex-col justify-between h-[380px] relative overflow-hidden">
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-2xl shadow-inner transition-all group-hover:scale-110 ${
                    isConnected ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'
                  }`}>
                    <i className={`fas ${tool.icon}`}></i>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {isConnected ? 'نشط (Full Power)' : 'وضع التعافي'}
                  </div>
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-3">{tool.name}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic border-r-2 border-indigo-100 pr-4">
                  "{tool.impact}"
                </p>
              </div>

              <div className="space-y-4 pt-6">
                {activeKeyInput === tool.id ? (
                  <div className="flex flex-col gap-3 animate-slide-up">
                    <input 
                      type="password" 
                      placeholder="لصق مفتاح الـ API هنا..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500/20 text-right"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                    />
                    <div className="flex gap-2">
                       <button 
                        onClick={() => { onConnect(tool.id, inputValue); setActiveKeyInput(null); setInputValue(''); }}
                        className="flex-1 bg-indigo-600 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest"
                       >تفعيل الحاسة</button>
                       <button onClick={() => setActiveKeyInput(null)} className="px-4 py-3 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black uppercase">إلغاء</button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setActiveKeyInput(tool.id)}
                    className={`w-full py-5 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all ${
                      isConnected ? 'bg-slate-900 text-white' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    {isConnected ? 'تحديث المفتاح الاستراتيجي' : 'ربط المنصة الآن'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationCenter;
