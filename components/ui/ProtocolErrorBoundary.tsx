
import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children?: ReactNode; }
interface State { hasError: boolean; error: Error | null; }

class ProtocolErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CRITICAL_STALL]:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-12 text-center animate-precision">
          <div className="w-24 h-24 bg-red-600/10 border border-red-600/20 rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
             <i className="fas fa-biohazard text-red-500 text-4xl animate-pulse"></i>
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-4">SYSTEM_HALTED</h2>
          <div className="max-w-md mx-auto space-y-4">
             <p className="text-slate-500 text-xs uppercase tracking-widest font-bold">Protocol Violation or Execution Timeout</p>
             <div className="p-6 bg-white/2 border border-white/5 rounded-2xl font-mono text-[10px] text-red-400 text-left overflow-auto max-h-40 italic">
                {this.state.error?.message || "Unknown execution error detected in the Sovereign Core."}
             </div>
             <button 
               onClick={() => {
                 localStorage.clear();
                 window.location.reload();
               }} 
               className="mt-8 prestige-btn prestige-btn-gold !bg-white !text-black shadow-2xl"
             >
               PURGE CACHE & REBOOT
             </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children || null;
  }
}

export default ProtocolErrorBoundary;
