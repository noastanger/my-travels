import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/leaflet-config';
import './styles/globals.css';
import App from './App';

// Register PWA service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // SW registration is best-effort
    });
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
