
import React, { useState } from 'react';
import { Domain, OutreachMessage } from '../types';
import { findStrategicAcquirersAI, generatePersonaPitchAI } from '../services/geminiService';

interface Props {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
}

const MessagingDashboard: React.FC<Props> = ({ domains, setDomains }) => {
  const [prospects, setProspects] = useState<any[]>([]);
  const [messages, setMessages] = useState<OutreachMessage[]>([]);
  const [isProspecting, setIsProspecting] = useState<string | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  const handleProspect = async (domain: Domain) => {
    setIsProspecting(domain.id);
    setSelectedDomain(domain);
    const leads = await findStrategicAcquirersAI(domain.name, domain.sector || 'Technology');
    setProspects(leads);
    setIsProspecting(null);
  };

  const handleGeneratePitch = async (company: any, persona: string) => {
    if (!selectedDomain) return;
    setIsGeneratingPitch(true);
    const content = await generatePersonaPitchAI(selectedDomain.name, company, persona);
    
    const newMessage: OutreachMessage = {
      id: Math.random().toString(),
      domainId: selectedDomain.id,
      recipient: company.companyName,
      recipientRole: persona,
      tone: 'Formal',
      status: 'draft',
      content: content || ''
    };
    
    setMessages(prev => [newMessage, ...prev]);
    setIsGeneratingPitch(false);
  };

  const handleSendViaGmail = (msg: OutreachMessage) => {
    const subject = encodeURIComponent(`Strategic Acquisition Inquiry: ${selectedDomain?.name}`);
    const body = encodeURIComponent(msg.content);
    // فتح Gmail مع مسودة جاهزة
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  const openProspectTool = (tool: 'linkedin' | 'hunter', companyName: string) => {
    const urls = {
      linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(companyName)} decision maker`,
      hunter: `https://hunter.io/search/${encodeURIComponent(companyName.toLowerCase().replace(/\s+/g, ''))}.com`
    };
    window.open(urls[tool], '_blank');
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased');

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Inventory Column */}
        <div className="lg:col-span-1 bg-white rounded-[32px] border shadow-sm flex flex-col h-[750px]">
          <div className="p-6 border-b bg-slate-50/50">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest text-right">اختر أصل للتسويق</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleProspect(d)}
                className={`p-5 cursor-pointer transition-all hover:bg-indigo-50/50 ${selectedDomain?.id === d.id ? 'bg-indigo-50 border-r-4 border-indigo-500' : ''}`}
              >
                <div className="font-bold text-slate-900 text-sm text-right">{d.name}</div>
                <div className="text-[10px] text-indigo-500 font-black uppercase mt-1 text-right">{d.sector}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Prospecting Column */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border shadow-sm flex flex-col h-[750px] relative overflow-hidden">
          {isProspecting ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">جاري البحث عن مشترين عبر الويب...</p>
            </div>
          ) : prospects.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="p-8 border-b flex justify-between items-center text-right">
                 <span className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-[10px] font-black">تم العثور على {prospects.length}</span>
                 <div>
                    <h3 className="font-black text-slate-800 uppercase text-lg tracking-tighter">المشترون الاستراتيجيون</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">بيانات مستخرجة من التقارير المالية والأخبار</p>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {prospects.map((company, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-3xl p-6 border border-slate-100 hover:border-indigo-200 transition-all group text-right">
                     <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                           <button onClick={() => openProspectTool('linkedin', company.companyName)} className="w-9 h-9 bg-white border rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="بحث عن المدير في LinkedIn">
                              <i className="fab fa-linkedin-in text-xs"></i>
                           </button>
                           <button onClick={() => openProspectTool('hunter', company.companyName)} className="w-9 h-9 bg-white border rounded-xl flex items-center justify-center text-orange-500 hover:bg-orange-500 hover:text-white transition-all shadow-sm" title="استخراج البريد من Hunter.io">
                              <i className="fas fa-envelope-open-text text-xs"></i>
                           </button>
                        </div>
                        <div>
                          <div className="font-black text-slate-900 text-lg">{company.companyName}</div>
                          <span className={`text-[9px] font-black px-2 py-1 rounded uppercase ${
                            company.buyingPower === 'High' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                          }`}>القوة الشرائية: {company.buyingPower === 'High' ? 'عالية' : 'متوسطة'}</span>
                        </div>
                     </div>
                     <p className="text-xs text-slate-500 leading-relaxed font-medium mb-6 italic border-r-2 border-indigo-100 pr-4">
                        "{company.reason}"
                     </p>
                     <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => handleGeneratePitch(company, 'المدير التنفيذي')}
                          className="py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all"
                        >
                          توليد عرض للمدير
                        </button>
                        <button 
                          onClick={() => handleGeneratePitch(company, 'مدير التسويق')}
                          className="py-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase hover:bg-slate-900 hover:text-white transition-all"
                        >
                          توليد عرض للتسويق
                        </button>
                     </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
               <i className="fas fa-paper-plane text-7xl mb-6 opacity-5"></i>
               <p className="italic text-sm text-slate-400">اختر أصلاً من القائمة لبدء عملية "صيد المشترين".</p>
            </div>
          )}
        </div>

        {/* Gmail Drafts Column */}
        <div className="lg:col-span-1 bg-[#0b0e14] rounded-[40px] text-white flex flex-col h-[750px] overflow-hidden shadow-2xl border border-white/5">
          <div className="p-8 border-b border-white/5 bg-white/5 flex justify-between items-center text-right">
             <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white text-xs">
                <i className="fab fa-google"></i>
             </div>
             <div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">مسودات Gmail</h3>
                <p className="text-[8px] text-slate-500 font-bold uppercase">جاهزة للإرسال الرسمي</p>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/5 rounded-3xl p-6 border border-white/10 relative group text-right hover:bg-white/10 transition-all">
                 <div className="text-[9px] font-black text-indigo-300 uppercase mb-3 flex items-center justify-end gap-2">
                    {msg.recipientRole} @ {msg.recipient} <i className="fas fa-user-tie"></i>
                 </div>
                 <p className="text-[11px] text-slate-300 leading-relaxed italic mb-6 line-clamp-4">
                   "{msg.content}"
                 </p>
                 <button 
                  onClick={() => handleSendViaGmail(msg)}
                  className="w-full py-4 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-900/20"
                 >
                    <i className="fab fa-google"></i> فتح في Gmail
                 </button>
              </div>
            ))}
            {messages.length === 0 && !isGeneratingPitch && (
              <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-30">
                <i className="fas fa-envelope-open text-5xl mb-4"></i>
                <p className="text-[10px] font-black uppercase">لا توجد مسودات حالياً</p>
              </div>
            )}
            {isGeneratingPitch && (
              <div className="space-y-4">
                 <div className="animate-pulse bg-white/5 rounded-3xl h-48 w-full"></div>
                 <div className="animate-pulse bg-white/5 rounded-3xl h-48 w-full"></div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MessagingDashboard;
