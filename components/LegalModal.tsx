
import React from 'react';

interface Props {
  type: 'tos' | 'privacy';
  onClose: () => void;
  lang: 'ar' | 'en';
}

const LegalModal: React.FC<Props> = ({ type, onClose, lang }) => {
  const content = {
    en: {
      tos: {
        title: "Sovereign Terms of Service",
        subtitle: "Protocol v1.0 - Asset Management Framework",
        sections: [
          { h: "1. Acceptance of Protocol", p: "By accessing Isthmic Pro, you engage in a sovereign agreement to utilize multi-agent AI for digital asset analysis. Usage implies full consent to automated execution protocols." },
          { h: "2. AI Liability Disclaimer", p: "Inferences provided by Gemini 3 and other models are probabilistic. Tactical decisions based on AI logic remain the sole responsibility of the human commander." },
          { h: "3. Acquisition Ethics", p: "Users must not utilize the Drop Sniper or Forensic agents for illegal trademark infringement or malicious cyber-squatting." },
          { h: "4. Subscription & Quotas", p: "Access is granted based on subscription tiers. Quotas for AI scans and audits are reset monthly. Unused units do not roll over." }
        ]
      },
      privacy: {
        title: "Privacy Manifesto",
        subtitle: "Data Sovereignty & Local Encryption",
        sections: [
          { h: "1. Local-First Residency", p: "Your tactical data resides in your browser's secure local storage. Isthmic Pro does not store your domain portfolio on central servers unless cloud sync is activated." },
          { h: "2. API Key Security", p: "Private keys (Gemini, Hunter, etc.) are used for runtime execution and are never logged or stored outside your sovereign environment." },
          { h: "3. Analytics & Usage", p: "We track usage frequency (scans/audits) solely to enforce subscription quotas and optimize agent performance." }
        ]
      }
    },
    ar: {
      tos: {
        title: "شروط الخدمة السيادية",
        subtitle: "بروتوكول الإصدار 1.0 - إطار إدارة الأصول",
        sections: [
          { h: "1. قبول البروتوكول", p: "عبر دخولك إلى Isthmic Pro، أنت تدخل في اتفاقية سيادية لاستخدام وكلاء الذكاء الاصطناعي لتحليل الأصول الرقمية." },
          { h: "2. إخلاء مسؤولية الذكاء الاصطناعي", p: "الاستنتاجات المقدمة من النماذج هي احتمالية. القرارات التكتيكية المبنية على منطق الآلة تظل تحت مسؤولية القائد البشري بالكامل." },
          { h: "3. أخلاقيات الاستحواذ", p: "يمنع استخدام قناص الـ Drop أو الوكلاء الجنائيين في انتهاكات العلامات التجارية غير القانونية." },
          { h: "4. الاشتراكات والحصص", p: "يتم منح الوصول بناءً على فئة الاشتراك. يتم تصفير حصص الفحص والتدقيق شهرياً." }
        ]
      },
      privacy: {
        title: "بيان الخصوصية",
        subtitle: "سيادة البيانات والتشفير المحلي",
        sections: [
          { h: "1. البيانات المحلية أولاً", p: "تقيم بياناتك التكتيكية في التخزين المحلي لمتصفحك. Isthmic Pro لا تخزن محفظتك في خوادم مركزية إلا في حال تفعيل المزامنة." },
          { h: "2. أمان مفاتيح الـ API", p: "تستخدم المفاتيح الخاصة لتنفيذ العمليات فقط، ولا يتم تسجيلها أو تخزينها خارج بيئتك السيادية." },
          { h: "3. تحليلات الاستخدام", p: "نقوم بتتبع تكرار الاستخدام (فحوصات/تدقيق) فقط لفرض حصص الاشتراك وتحسين أداء الوكلاء." }
        ]
      }
    }
  };

  const active = content[lang][type];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 lg:p-12 animate-fade-in">
      <div className="absolute inset-0 bg-[#0a0a0c]/95 backdrop-blur-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-[#111113] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl flex flex-col h-[85vh] animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="p-10 lg:p-14 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
           <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl prestige-heading text-white italic italic leading-none">{active.title}</h2>
              <p className="text-[#c5a059] text-[10px] font-black uppercase tracking-[0.4em] mt-4">{active.subtitle}</p>
           </div>
           <i className="fas fa-gavel absolute right-[-20px] top-[-20px] text-white/[0.02] text-[180px] pointer-events-none -rotate-12"></i>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-10 lg:p-14 space-y-12 custom-scrollbar">
           {active.sections.map((sec, i) => (
             <div key={i} className="space-y-4">
                <h3 className="text-xl font-black text-white italic tracking-tight border-r-2 border-[#c5a059] pr-6">{sec.h}</h3>
                <p className="text-slate-400 text-base leading-relaxed font-medium pl-8">
                  {sec.p}
                </p>
             </div>
           ))}
           <div className="pt-10 opacity-30 text-[10px] font-mono text-slate-500 uppercase tracking-widest text-center">
             End of Sovereign Document
           </div>
        </div>

        {/* Footer Action */}
        <div className="p-8 border-t border-white/5 bg-black/50 flex justify-center">
           <button 
             onClick={onClose}
             className="px-14 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-[#c5a059] hover:text-white transition-all shadow-xl"
           >
             Acknowledge & Close
           </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
