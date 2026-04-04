
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDomainContext } from '../context/DomainContext';

const AuthForm: React.FC = () => {
  const { login, loginWithEmail, signup } = useAuth();
  const { addLog } = useDomainContext();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      if (isLogin) {
        await loginWithEmail(formData.email, formData.password);
        addLog('System', 'Identity Link Established.', 'success');
      } else {
        await signup(formData.name, formData.email, formData.password);
        setStatus({ type: 'success', msg: 'Identity setup complete! Your sovereign vault is initialized.' });
        setIsLogin(true);
      }
    } catch (e: any) {
      console.error("AUTH_UI_ERROR:", e.message);
      setStatus({ type: 'error', msg: e.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await login();
      addLog('System', 'Google Identity Link Established.', 'success');
    } catch (e: any) {
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
               {isLogin ? 'Command Authentication' : 'Initialize Sovereign Identity'}
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
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-black py-5 px-4 rounded-2xl transition-all flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              {isLoading ? 'SYNCING...' : 'Continue with Google'}
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="h-[1px] flex-1 bg-white/5"></div>
              <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">OR</span>
              <div className="h-[1px] flex-1 bg-white/5"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                {!isLogin && (
                  <input 
                    required type="text" placeholder="FULL NAME" 
                    className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] text-center font-black text-[10px] transition-all uppercase tracking-widest"
                    value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                )}
                <input 
                  required type="email" placeholder="IDENTITY EMAIL" 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] text-center font-black text-[10px] transition-all uppercase tracking-widest"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                <input 
                  required type="password" placeholder="SECURITY KEY" 
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] text-center font-black text-[10px] transition-all uppercase tracking-widest"
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <button 
                disabled={isLoading} 
                className="w-full bg-[#d4af37] text-black hover:bg-[#c5a059] font-black py-6 rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-2xl"
              >
                {isLoading ? 'SYNCING DATA...' : (isLogin ? 'ESTABLISH LINK' : 'INITIALIZE PROTOCOL')}
              </button>
            </form>
          </div>

          <footer className="pt-8 border-t border-white/5 text-center">
             <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setStatus(null); }}
              className="text-[9px] font-black text-slate-600 hover:text-[#d4af37] uppercase tracking-[0.4em] transition-all"
             >
               {isLogin ? "Lost Access? Request New Identity" : "Already Secured? Establish Link"}
             </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
