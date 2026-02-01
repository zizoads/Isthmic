
import React, { useState } from 'react';
import { useDomainContext } from '../context/DomainContext';

const AuthForm: React.FC = () => {
  const { login, signup, addLog } = useDomainContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    // Sovereign Access Control: Invite Code validation for new units
    if (!isLogin && inviteCode !== 'ISTHMIC-BETA-2025') {
      setErrorMessage("INVALID_INVITE_CODE: Access restricted to authorized Beta units.");
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
        setErrorMessage("PROTOCOL_INITIATED: Please check your email to verify your identity.");
      }
    } catch (error: any) {
      const msg = error.message || "Access Protocol Denied";
      setErrorMessage(msg);
      addLog('Auth', msg, 'critical');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c] relative">
      <div className="bg-grid"></div>
      <div className="noise-bg"></div>
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#d4af37]/5 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-xl relative z-10">
        <div className="glass-panel p-12 lg:p-20 space-y-12 text-center border-white/10">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.6em] text-[#d4af37] uppercase opacity-60">Industrial Grade AI Suite</span>
            <h1 className="prestige-title heading-lg italic text-white leading-none">Isthmic Pro.</h1>
            <p className="text-slate-400 text-lg italic max-w-sm mx-auto">
              {isLogin ? "Return to your sovereign digital asset command." : "Initiate your journey into multi-agent asset management."}
            </p>
          </div>

          {errorMessage && (
            <div className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest animate-slide-up ${
              errorMessage.includes('verified') || errorMessage.includes('check') 
              ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' 
              : 'bg-red-500/10 border-red-500/20 text-red-500'
            }`}>
              <i className="fas fa-shield-halved mr-2"></i> {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <input 
                  type="text" 
                  required 
                  value={name} 
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600"
                  placeholder="Full Legal Name"
                />
                <input 
                  type="text" 
                  required 
                  value={inviteCode} 
                  onChange={(e) => setInviteCode(e.target.value)}
                  className="w-full bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-2xl outline-none text-[#d4af37] font-black uppercase tracking-widest focus:border-[#d4af37] transition-all text-center placeholder:text-indigo-500/40"
                  placeholder="Sovereign Invite Code"
                />
              </>
            )}
            <input 
              type="email" 
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600"
              placeholder="Sovereign Email Address"
            />
            <input 
              type="password" 
              required 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600"
              placeholder="Security Keyphrase"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="prestige-btn prestige-btn-gold w-full mt-4"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-link mr-3"></i>}
              <span>{isLogin ? 'ESTABLISH LINK' : 'INITIATE PROTOCOL'}</span>
            </button>
          </form>

          <div className="pt-6 space-y-6">
            <button 
              onClick={() => { setIsLogin(!isLogin); setErrorMessage(null); }}
              className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
            >
              {isLogin ? "Generate New Command Identity?" : "Return to Master Login?"}
            </button>
            <div className="flex justify-center gap-8 opacity-10">
               <i className="fas fa-shield-halved text-xl"></i>
               <i className="fas fa-fingerprint text-xl"></i>
               <i className="fas fa-microchip text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
