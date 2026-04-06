
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
    
  } catch (error) {
    console.error("MOUNT_CRASH:", error);
  }
};

mountApplication();
