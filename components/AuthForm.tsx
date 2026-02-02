
import React, { useState } from 'react';
import { useDomainContext } from '../context/DomainContext';
import { AuthService } from '../services/AuthService';

const AuthForm: React.FC = () => {
  const { login, addLog } = useDomainContext();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (step === 1) {
          await AuthService.signup(name, email, password);
          setStatus({ 
            type: 'success', 
            message: "Sequence initiated. Access the 6-digit code in the console (F12)." 
          });
          setStep(2);
        } else {
          const success = await AuthService.verifyEmailCode(email, otp);
          if (success) {
            setStatus({ 
              type: 'success', 
              message: "Identity confirmed. Transitioning to Command Center..." 
            });
            
            setTimeout(() => {
              setIsLogin(true);
              setStep(1);
              setOtp('');
              setStatus({ type: 'success', message: "Sovereign Link Established. Please authenticate." });
            }, 1500);
          }
        }
      }
    } catch (error: any) {
      let msg = error.message;
      
      if (msg === "IDENTITY_PENDING") {
        // Recovery flow: Redirect to verification step
        setIsLogin(false);
        setStep(2);
        msg = "Account detected but unverified. Please enter your verification code or request a new one.";
        setStatus({ type: 'warning' as any, message: msg });
      } else {
        if (msg === "IDENTITY_EXISTS") msg = "Identity recognized. Please proceed via the master login.";
        if (msg.includes("SYSTEM_COOLDOWN")) msg = "System Cooling Active. Please pause for several minutes.";
        
        setStatus({ type: 'error', message: msg });
      }
      
      addLog('Auth', msg, 'critical');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
       setStatus({ type: 'error', message: "Please provide an email address to receive a new signal." });
       return;
    }
    setIsLoading(true);
    try {
      // If we don't have the name (from login redirect), we use a placeholder
      await AuthService.signup(name || "Sovereign User", email, password);
      setStatus({ type: 'success', message: "New sequence dispatched. Check console (F12)." });
    } catch (error: any) {
      setStatus({ type: 'error', message: error.message });
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
        <div className="glass-panel p-12 lg:p-20 space-y-12 text-center border-white/10 shadow-2xl">
          <div className="space-y-6">
            <span className="text-[10px] font-black tracking-[0.6em] text-[#d4af37] uppercase opacity-60">Sovereign Asset Management</span>
            <h1 className="prestige-title heading-lg italic text-white leading-none">Isthmic.</h1>
            <p className="text-slate-400 text-lg italic max-w-sm mx-auto">
              {isLogin ? "Restore your sovereign digital asset command." : (step === 1 ? "Initiate your identity into the ecosystem." : "Execute the verification sequence.")}
            </p>
          </div>

          {status && (
            <div className={`p-5 rounded-2xl border text-[10px] font-black uppercase tracking-widest animate-slide-up leading-relaxed ${
              status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
              status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              'bg-amber-500/10 border-amber-500/20 text-amber-500'
            }`}>
              <i className={`fas ${status.type === 'success' ? 'fa-check-circle' : 'fa-shield-halved'} mr-2`}></i> {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && step === 1 && (
              <input 
                type="text" 
                required 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600 font-medium"
                placeholder="Full Name"
              />
            )}
            
            {/* Step 1 Fields */}
            {step === 1 && (
              <>
                <input 
                  type="email" 
                  required 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600 font-medium"
                  placeholder="Email Address"
                />
                <input 
                  type="password" 
                  required 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-white focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600 font-medium"
                  placeholder="Security Keyphrase"
                />
              </>
            )}

            {/* Step 2 Field */}
            {!isLogin && step === 2 && (
              <div className="space-y-6">
                <input 
                  type="text" 
                  required 
                  maxLength={6}
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none text-[#d4af37] focus:border-[#d4af37] transition-all text-center placeholder:text-slate-600 font-black text-4xl tracking-[0.5em]"
                  placeholder="000000"
                />
                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-[10px] text-slate-500 uppercase font-black hover:text-[#d4af37] transition-colors"
                >
                  Resend Verification Signal
                </button>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="prestige-btn prestige-btn-gold w-full mt-4"
            >
              {isLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-link mr-3"></i>}
              <span>
                {isLogin ? 'ESTABLISH LINK' : (step === 1 ? 'DISPATCH CODE' : 'VERIFY IDENTITY')}
              </span>
            </button>
          </form>

          <div className="pt-6 space-y-6 border-t border-white/5">
            <button 
              onClick={() => { 
                setIsLogin(!isLogin); 
                setStep(1);
                setStatus(null); 
              }}
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
