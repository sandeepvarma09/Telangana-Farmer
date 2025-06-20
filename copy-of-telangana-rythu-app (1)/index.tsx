import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './hooks/useLanguage';
import { BackgroundProvider } from './src/contexts/BackgroundContext'; // Updated path

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <BackgroundProvider> {/* New */}
        <App />
      </BackgroundProvider>
    </LanguageProvider>
  </React.StrictMode>
);