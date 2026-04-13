import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, ArrowRight, Mail, Key, User } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { login, loginWithEmail, registerWithEmail } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        if (!name) throw new Error("Name is required for registration");
        await registerWithEmail(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] relative z-10 overflow-hidden p-4">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full p-6 md:p-10 bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-[30px] md:rounded-[40px] shadow-2xl relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-black border border-white/10 rounded-xl md:rounded-2xl mx-auto flex items-center justify-center mb-4 md:mb-6 shadow-lg">
            <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-3xl md:text-4xl prestige-title text-white italic mb-2">Sovereign.</h1>
          <p className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Military-Grade Intelligence</p>
        </div>

        <div className="flex bg-black/50 p-1 rounded-2xl mb-8 border border-white/5">
          <button 
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
          >
            Create Account
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              required
            />
          </div>

          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#d4af37]/50 transition-colors"
              required
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-3 group mt-2 disabled:opacity-50"
          >
            {loading ? 'Processing...' : (mode === 'login' ? 'Access System' : 'Initialize Profile')}
            {!loading && <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />}
          </button>
        </form>

        <div className="relative flex items-center py-2 mb-6">
          <div className="flex-grow border-t border-white/10"></div>
          <span className="flex-shrink-0 mx-4 text-slate-600 text-xs uppercase tracking-widest">Or</span>
          <div className="flex-grow border-t border-white/10"></div>
        </div>

        <div className="space-y-6">
          <button 
            type="button"
            onClick={login}
            className="w-full py-4 bg-transparent border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-white/5 transition-all flex items-center justify-center gap-3"
          >
            Authenticate via Google
          </button>

          <p className="text-[9px] text-slate-600 text-center uppercase tracking-widest leading-relaxed">
            By authenticating, you agree to the <br/>
            <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Sovereign Terms of Service</span> & <span className="text-slate-400 hover:text-white cursor-pointer transition-colors">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
