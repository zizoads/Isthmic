
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDomainContext } from '../../context/DomainContext';

const AuthForm: React.FC = () => {
  const { login } = useAuth();
  const { addLog } = useDomainContext();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setStatus(null);
    try {
      await login();
      addLog('System', 'Google Identity Link Established.', 'success');
    } catch (e: any) {
      console.error("AUTH_UI_ERROR:", e.message);
      setStatus({ type: 'error', msg: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050507] p-6 font-sans relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#d4af37]/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-slate-800/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-lg relative z-10">
        <div className="bg-[#08080a] border border-white/5 p-12 space-y-12 rounded-[40px] shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
          
          <header className="text-center space-y-4">
             <div className="w-4 h-4 bg-[#d4af37] rounded-full mx-auto shadow-[0_0_25px_#d4af37] mb-6"></div>
             <h1 className="text-6xl prestige-title text-white italic leading-none tracking-tighter">Isthmic.</h1>
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.6em]">
               Command Authentication
             </p>
          </header>

          {status && (
            <div className={`p-6 rounded-3xl text-[11px] font-black uppercase tracking-widest text-center border leading-relaxed ${
              status.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {status.msg}
            </div>
          )}

          <div className="space-y-6">
            <button 
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-white/90 font-black py-6 px-4 rounded-2xl transition-all flex items-center justify-center gap-4 text-[11px] uppercase tracking-[0.2em] shadow-2xl"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {isLoading ? 'SYNCING...' : 'Establish Link with Google'}
            </button>
            
            <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest text-center">
              Secure Sovereign Protocol v4.0
            </p>
          </div>

          <footer className="pt-8 border-t border-white/5 text-center">
             <p className="text-[8px] font-black text-slate-800 uppercase tracking-[0.5em]">
               Isthmic Pro - All Rights Reserved
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
