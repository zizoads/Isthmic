
import React, { useState } from 'react';
import { useDomainContext } from '../context/DomainContext';

const AuthForm: React.FC = () => {
  const { login, signup, addLog } = useDomainContext();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
    } catch (error: any) {
      addLog('Auth', 'Protocol Access Denied: Verification Failed', 'critical');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0c] relative overflow-hidden">
      <div className="bg-grid"></div>
      <div className="noise-bg"></div>
      
      <div className="w-full max-w-lg relative z-10">
        <div className="square-box border-white/5 bg-black/60 backdrop-blur-3xl !p-0">
          {/* Top Decorative Bar */}
          <div className="bg-white/5 p-4 flex justify-between items-center border-b border-white/5">
            <span className="text-[10px] font-black tracking-[0.3em] text-[#d4af37] uppercase">ISTHMIC_SECURE_AUTH_V4.0</span>
            <div className="flex gap-1.5">
               <div className="w-2 h-2 rounded-full bg-white/10"></div>
               <div className="w-2 h-2 rounded-full bg-white/10"></div>
            </div>
          </div>

          <div className="p-10 lg:p-16 space-y-12">
            <div className="space-y-4 text-center">
              <h1 className="prestige-title heading-xl italic">Isthmic.</h1>
              <p className="font-bold text-[10px] uppercase tracking-[0.5em] text-slate-500">Sovereign Domain Intelligence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {!isLogin && (
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Full Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 p-5 outline-none text-white focus:border-[#d4af37] transition-all"
                    placeholder="Enter Legal Identity..."
                  />
                </div>
              )}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Sovereign Email</label>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 outline-none text-white focus:border-[#d4af37] transition-all"
                  placeholder="admin@sovereign.io"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Security Phrase</label>
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 outline-none text-white focus:border-[#d4af37] transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="square-btn w-full py-5 text-sm"
              >
                {isLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
                <span className="ml-2">{isLogin ? 'ESTABLISH LINK' : 'INITIATE PROTOCOL'}</span>
              </button>
            </form>

            <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[10px] font-black uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors"
              >
                {isLogin ? "Generate New Command Identity?" : "Return to Master Login?"}
              </button>
              <div className="flex items-center gap-4 text-[9px] font-mono text-slate-700 uppercase">
                 <i className="fas fa-shield-halved"></i>
                 <span>AES-512 Encryption Protocol Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
