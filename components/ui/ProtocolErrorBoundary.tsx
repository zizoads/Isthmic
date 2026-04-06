
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
        <div className="h-screen w-full bg-[#0a0a0c] flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">SYSTEM_HALTED</h2>
          <div className="p-4 bg-red-900/20 border border-red-500/50 rounded text-white text-sm font-mono overflow-auto max-w-full">
             <p className="font-bold mb-2">Error Details:</p>
             {this.state.error?.message || "Unknown execution error detected."}
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }} 
            className="mt-6 px-6 py-2 bg-white text-black font-bold rounded"
          >
            REBOOT
          </button>
        </div>
      );
    }
    return (this as any).props.children || null;
  }
}

export default ProtocolErrorBoundary;
