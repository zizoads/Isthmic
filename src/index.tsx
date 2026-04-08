
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DomainProvider } from './context/DomainContext';
import { AuthProvider } from './context/AuthContext';
import { NavigationProvider } from './context/NavigationContext';
import { SecurityActivation } from './main.security';

/**
 * ⚡ SOVEREIGN BOOT SEQUENCE (Ultra-Fast)
 * Stage 0: Initializing core systems
 */

const mountApplication = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error("FATAL: Root element missing from DOM.");
    return;
  }

  try {
    // 📡 Activate Security System (Military Suite)
    // Activation optimized to be non-blocking for critical operations
    SecurityActivation.activate();

    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <AuthProvider>
          <DomainProvider>
            <NavigationProvider>
              <App />
            </NavigationProvider>
          </DomainProvider>
        </AuthProvider>
      </React.StrictMode>
    );
    
    (window as any).markAppAsMounted();
    
  } catch (error: any) {
    console.error("MOUNT_CRASH:", error);
    const panicUi = document.getElementById('panic-ui');
    if (panicUi) {
      panicUi.style.display = 'flex';
      const errorMsg = document.createElement('p');
      errorMsg.style.color = '#ff4444';
      errorMsg.style.fontSize = '12px';
      errorMsg.style.marginTop = '10px';
      errorMsg.style.fontFamily = 'monospace';
      errorMsg.innerText = 'MOUNT_CRASH: ' + (error.message || String(error));
      panicUi.appendChild(errorMsg);
    }
  }
};

mountApplication();
