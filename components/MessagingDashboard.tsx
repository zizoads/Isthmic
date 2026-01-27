
import React, { useState } from 'react';
import { Domain, OutreachMessage } from '../types';
import { harvestBulkLeadsAI, generatePersonaPitchAI } from '../services/geminiService';

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
    // Deep corporate harvesting
    const leads = await harvestBulkLeadsAI(domain.name, domain.sector || 'Technology');
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
    const subject = encodeURIComponent(`Strategic Acquisition Opportunity: ${selectedDomain?.name}`);
    const body = encodeURIComponent(msg.content);
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, '_blank');
  };

  const purchasedDomains = domains.filter(d => d.status === 'purchased' || d.status === 'negotiating');

  return (
    <div className="space-y-8 animate-fade-in" dir="rtl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Inventory Column */}
        <div className="lg:col-span-1 bg-[#08090d] border border-white/5 rounded-[32px] flex flex-col h-[750px] overflow-hidden">
          <div className="p-6 border-b border-white/5 bg-white/2">
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">أصول بانتظار التسييل</h3>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-white/5 custom-scrollbar">
            {purchasedDomains.map(d => (
              <div 
                key={d.id} 
                onClick={() => handleProspect(d)}
                className={`p-5 cursor-pointer transition-all ${selectedDomain?.id === d.id ? 'bg-indigo-600/20 border-r-4 border-indigo-500' : 'hover:bg-white/5'}`}
              >
                <div className="font-bold text-white text-sm text-right">{d.name}</div>
                <div className="text-[10px] text-indigo-500 font-black uppercase mt-1 text-right">{d.sector}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Corporate Harvesting Column */}
        <div className="lg:col-span-2 bg-[#08090d] border border-white/5 rounded-[40px] flex flex-col h-[750px] relative overflow-hidden">
          {isProspecting ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-6">
               <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">حصاد بيانات الشركات والمشترين الاستراتيجيين...</p>
            </div>
          ) : prospects.length > 0 ? (
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-white/5 flex justify-between items-center text-right bg-white/2">
                 <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black">مكتشف: {prospects.length}</span>
                 <div>
                    <h3 className="font-black text-white uppercase text-lg tracking-tighter">قائمة صيد الشركات</h3>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">تحليل التآزر المؤسسي (Corporate Synergy)</p>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {prospects.map((company, idx) => (
                  <div key={idx} className="bg-white/2 rounded-[32px] p-8 border border-white/5 hover:border-indigo-500/30 transition-all group text-right relative overflow-hidden">
                     <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2">
                           <button className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-indigo-400 hover:bg-indigo-600 hover:text-white transition-all shadow-xl">
                              <i className="fab fa-linkedin-in text-sm"></i>
                           </button>
                        </div>
                        <div>
                          <div className="font-black text-white text-xl">{company.companyName}</div>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            <span className="text-[9px] font-black text-slate-400 uppercase">القدرة: {company.estimatedValuation}</span>
                          </div>
                        </div>
                     </div>
                     <p className="text-xs text-slate-400 leading-relaxed font-medium mb-8 italic border-r-4 border-indigo-500/20 pr-6">
                        "{company.synergyReason}"
                     </p>
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => handleGeneratePitch(company, 'VP of Strategy')}
                          className="py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all"
                        >
                          عرض "نائب الاستراتيجية"
                        </button>
                        <button 
                          onClick={() => handleGeneratePitch(company, 'Marketing Director')}
                          className="py-4 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-2xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all"
                        >
                          عرض "مدير التسويق"
                        </button>
                     </div>
                     <i className="fas fa-building absolute left-[-20px] bottom-[-20px] text-white/2 text-[100px] pointer-events-none"></i>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-700">
               <i className="fas fa-satellite-dish text-7xl mb-6 opacity-10 animate-pulse"></i>
               <p className="italic text-[10px] font-black uppercase tracking-[0.4em]">بانتظار اختيار أصل لبدء الحصاد المؤسسي</p>
            </div>
          )}
        </div>

        {/* Intelligence Pitch Column */}
        <div className="lg:col-span-1 bg-[#05070a] border border-white/5 rounded-[40px] flex flex-col h-[750px] overflow-hidden shadow-2xl">
          <div className="p-8 border-b border-white/5 bg-white/2 flex justify-between items-center text-right">
             <div className="w-10 h-10 bg-red-600 rounded-2xl flex items-center justify-center text-white text-sm shadow-xl shadow-red-900/20">
                <i className="fab fa-google"></i>
             </div>
             <div>
                <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest">مسودات تكتيكية</h3>
                <p className="text-[8px] text-slate-500 font-bold uppercase">مهندسة لتحويل المشترين</p>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className="bg-white/2 rounded-[32px] p-6 border border-white/10 relative group text-right hover:bg-white/5 transition-all animate-slide-up">
                 <div className="text-[9px] font-black text-indigo-400 uppercase mb-4 flex items-center justify-end gap-2">
                    {msg.recipientRole} @ {msg.recipient} <i className="fas fa-user-shield"></i>
                 </div>
                 <p className="text-[11px] text-slate-400 leading-relaxed italic mb-8 line-clamp-6">
                   "{msg.content}"
                 </p>
                 <button 
                  onClick={() => handleSendViaGmail(msg)}
                  className="w-full py-5 bg-red-600 text-white rounded-[24px] text-[10px] font-black uppercase tracking-widest hover:bg-red-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/30"
                 >
                    <i className="fab fa-google"></i> إرسال عبر GMAIL
                 </button>
              </div>
            ))}
            {isGeneratingPitch && (
              <div className="space-y-6">
                 <div className="animate-pulse bg-white/5 rounded-[32px] h-64 w-full"></div>
                 <div className="animate-pulse bg-white/5 rounded-[32px] h-64 w-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagingDashboard;
