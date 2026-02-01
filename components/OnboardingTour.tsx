
import React, { useState, useEffect } from 'react';

interface TourStep {
  title: string;
  description: string;
  icon: string;
  target?: string;
}

interface Props {
  onComplete: () => void;
  lang: 'ar' | 'en';
}

const OnboardingTour: React.FC<Props> = ({ onComplete, lang }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const steps: TourStep[] = [
    {
      title: lang === 'ar' ? "مرحباً بك في Isthmic Pro" : "Welcome to Isthmic Pro",
      description: lang === 'ar' 
        ? "أنت الآن في مركز القيادة السيادية لإدارة الأصول الرقمية. سنأخذك في جولة سريعة لفهم أدواتك الجديدة." 
        : "You are now at the sovereign command center for digital asset management. Let's walk through your new toolkit.",
      icon: "fa-cube"
    },
    {
      title: lang === 'ar' ? "مركز الاستخبارات (Intelligence)" : "Intelligence Hub",
      description: lang === 'ar'
        ? "هنا يعمل العقل المدبر. حدد استراتيجيتك، ودع الوكلاء يكتشفون ثغرات السوق والفرص الذهبية."
        : "Where the Mastermind operates. Define your thesis and let the agents discover market gaps and alpha opportunities.",
      icon: "fa-brain",
      target: "intelligence"
    },
    {
      title: lang === 'ar' ? "مكتب الاستحواذ (Acquisition)" : "Acquisition Desk",
      description: lang === 'ar'
        ? "قناص الـ Drop والتدقيق الجنائي للعلامات التجارية. كل ما تحتاجه لصيد الأصول بأمان."
        : "The Drop Sniper and Forensic Trademark Audit. Everything you need to hunt assets with surgical precision.",
      icon: "fa-crosshairs",
      target: "acquisition"
    },
    {
      title: lang === 'ar' ? "مركز العمليات (Operations)" : "Operations Hub",
      description: lang === 'ar'
        ? "هندسة الهوية البصرية، بناء إثبات القيمة، وتطوير نماذج الربح التلقائية لكل أصل."
        : "Visual DNA engineering, building value proof, and architecting automated revenue models for every asset.",
      icon: "fa-layer-group",
      target: "operations"
    },
    {
      title: lang === 'ar' ? "محرك التسييل (Liquidation)" : "Liquidation Engine",
      description: lang === 'ar'
        ? "غرفة الحرب للمفاوضات. تواصل مع المشترين الاستراتيجيين وأغلق الصفقات بأعلى عائد."
        : "The Negotiation War Room. Reach out to strategic buyers and close deals with maximum alpha.",
      icon: "fa-money-bill-wave",
      target: "liquidation"
    },
    {
      title: lang === 'ar' ? "الجناح التنفيذي (Executive Suite)" : "Executive Suite",
      description: lang === 'ar'
        ? "إدارة هويتك، مفاتيح الـ API، والتقارير المالية الشاملة لمحفظتك."
        : "Manage your identity, API gateways, and comprehensive financial reporting for your portfolio.",
      icon: "fa-user-tie",
      target: "management"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleFinish = () => {
    setIsVisible(false);
    setTimeout(onComplete, 500);
  };

  return (
    <div className={`fixed inset-0 z-[1000] flex items-center justify-center p-6 transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-[#0a0a0c]/80 backdrop-blur-md" onClick={handleFinish}></div>
      
      <div className="relative w-full max-w-xl bg-[#111113] border border-white/10 rounded-[48px] p-10 lg:p-14 shadow-2xl overflow-hidden animate-precision" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex justify-between items-center mb-10">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentStep ? 'w-8 bg-[#c5a059]' : 'w-2 bg-white/10'}`}></div>
            ))}
          </div>
          <button onClick={handleFinish} className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">
            {lang === 'ar' ? 'تخطي الجولة' : 'Skip Tour'}
          </button>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="w-20 h-20 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-3xl flex items-center justify-center text-[#c5a059] text-3xl shadow-2xl">
            <i className={`fas ${steps[currentStep].icon}`}></i>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-3xl lg:text-4xl prestige-heading text-white italic leading-tight">
              {steps[currentStep].title}
            </h3>
            <p className="text-slate-400 text-lg leading-relaxed font-medium italic">
              {steps[currentStep].description}
            </p>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={handleNext}
              className="flex-1 bg-white text-black py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#c5a059] hover:text-white transition-all shadow-xl"
            >
              {currentStep === steps.length - 1 ? (lang === 'ar' ? 'إغلاق' : 'Finish') : (lang === 'ar' ? 'التالي' : 'Next Step')}
            </button>
            {currentStep > 0 && (
              <button 
                onClick={handlePrev}
                className="px-10 bg-white/5 border border-white/10 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
              >
                {lang === 'ar' ? 'السابق' : 'Back'}
              </button>
            )}
          </div>
        </div>

        <i className={`fas ${steps[currentStep].icon} absolute right-[-40px] bottom-[-40px] text-white/[0.02] text-[250px] pointer-events-none rotate-12 transition-all duration-1000`}></i>
      </div>
    </div>
  );
};

export default OnboardingTour;
