import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, ArrowRight } from 'lucide-react';

const AuthForm: React.FC = () => {
  const { login } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c] relative z-10 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af37]/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-md w-full p-10 bg-[#111113]/80 backdrop-blur-xl border border-white/10 rounded-[40px] shadow-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg">
            <Shield className="w-8 h-8 text-[#d4af37]" />
          </div>
          <h1 className="text-4xl prestige-title text-white italic mb-2">Sovereign.</h1>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.5em]">Military-Grade Intelligence</p>
        </div>

        <div className="flex bg-black/50 p-1 rounded-2xl mb-8 border border-white/5">
          <button 
            onClick={() => setMode('login')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setMode('register')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'register' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-white'}`}
          >
            Request Access
          </button>
        </div>
        
        <div className="space-y-6">
          <button 
            onClick={login}
            className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#d4af37] transition-all flex items-center justify-center gap-3 group"
          >
            <Lock className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            {mode === 'login' ? 'Authenticate via Google' : 'Initialize Secure Profile'}
            <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
