import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DomainProvider } from './context/DomainContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <DomainProvider>
        <App />
      </DomainProvider>
    </React.StrictMode>
  );
}
