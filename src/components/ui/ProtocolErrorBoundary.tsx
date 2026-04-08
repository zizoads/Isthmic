import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex flex-col items-center justify-center bg-black text-red-500 font-mono p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">PROTOCOL_ERROR</h1>
          <p className="text-sm mb-4">{this.state.error?.message}</p>
          <button 
            className="px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors"
            onClick={() => window.location.reload()}
          >
            REBOOT_SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProtocolErrorBoundary;
