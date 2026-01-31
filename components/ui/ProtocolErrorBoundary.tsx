import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ProtocolErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("CRITICAL_UI_INTERRUPTION:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-red-500/20 bg-red-500/5 rounded-[40px] animate-precision text-center space-y-8">
          <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 text-3xl shadow-2xl">
            <i className="fas fa-microchip-slash"></i>
          </div>
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-red-500 uppercase tracking-[0.4em]">Protocol Interruption // انقطاع البروتوكول</h3>
            <h2 className="text-3xl prestige-heading text-white italic">"{this.props.fallbackName || 'Unit'} malfunction detected."</h2>
            <p className="text-slate-500 text-xs font-mono max-w-md mx-auto leading-relaxed">
              The internal logic engine encountered an unexpected state. Sovereign resilience protocol is now active.
            </p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={this.handleReset}
              className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
            >
              Attempt Soft Reboot
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:text-white transition-all"
            >
              System Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProtocolErrorBoundary;