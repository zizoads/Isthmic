
import React from 'react';

interface ArtifactData {
  headline: string;
  subheadline: string;
  features: string[];
  cta: string;
  primaryColor: string;
  accentColor: string;
  layoutType: 'modern' | 'corporate' | 'minimal';
}

interface Props {
  data: ArtifactData;
  domainName: string;
  lang: 'ar' | 'en';
}

const ArtifactViewer: React.FC<Props> = ({ data, domainName, lang }) => {
  return (
    <div className="w-full h-full bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-inner flex flex-col group animate-fade-in">
      {/* Browser Bar */}
      <div className="bg-slate-100 px-4 py-2 border-b flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
        <div className="bg-white px-4 py-1 rounded-md text-[9px] font-mono text-slate-400 border shadow-sm truncate max-w-[200px]">
          https://www.{domainName}
        </div>
        <div className="w-6"></div>
      </div>

      {/* Live Preview Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide select-none p-0 flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Dynamic Hero Section */}
        <section 
          className="p-10 lg:p-16 text-center space-y-6 transition-all" 
          style={{ background: `linear-gradient(135deg, ${data.primaryColor}0A 0%, ${data.primaryColor}1A 100%)` }}
        >
          <div 
            className="inline-block px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4"
            style={{ color: data.primaryColor, backgroundColor: `${data.primaryColor}15` }}
          >
            Coming Soon to {domainName}
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
            {data.headline}
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
            {data.subheadline}
          </p>
          <button 
            className="px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white shadow-xl hover:scale-105 transition-all"
            style={{ backgroundColor: data.primaryColor }}
          >
            {data.cta}
          </button>
        </section>

        {/* Features Grid */}
        <section className="p-8 lg:p-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.features.map((feature, i) => (
            <div key={i} className="p-5 border border-slate-100 rounded-2xl bg-white hover:border-indigo-100 transition-all flex items-start gap-4">
               <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0"
                style={{ backgroundColor: `${data.primaryColor}10`, color: data.primaryColor }}
               >
                <i className="fas fa-check"></i>
               </div>
               <div className="text-left">
                  <div className="text-[11px] font-black text-slate-800 uppercase mb-1">Benefit 0{i+1}</div>
                  <div className="text-xs text-slate-500 font-medium">{feature}</div>
               </div>
            </div>
          ))}
        </section>

        {/* Branding Footer */}
        <footer className="mt-auto p-8 border-t border-slate-100 bg-slate-50 flex flex-col items-center">
          <div className="text-lg font-black text-slate-900 mb-2">{domainName}</div>
          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">© 2024 Strategic Digital Asset</div>
        </footer>
      </div>
      
      {/* Overlay controls */}
      <div className="absolute bottom-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
         <button className="p-3 bg-slate-900 text-white rounded-full shadow-2xl hover:scale-110 transition-all">
            <i className="fas fa-expand"></i>
         </button>
      </div>
    </div>
  );
};

export default ArtifactViewer;
