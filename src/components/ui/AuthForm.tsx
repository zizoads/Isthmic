import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthForm: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0a0a0c] relative z-10">
      <div className="max-w-md w-full p-8 bg-[#111113] border border-white/10 rounded-3xl shadow-2xl text-center space-y-8">
        <div>
          <h1 className="text-4xl prestige-title text-white italic mb-2">Sovereign.</h1>
          <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.5em]">Identity Verification Required</p>
        </div>
        
        <button 
          onClick={login}
          className="w-full py-4 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-[#d4af37] transition-colors"
        >
          Authenticate via Google
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
