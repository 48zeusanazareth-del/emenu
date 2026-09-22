import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Ensure window.fetch has both getter and setter so third-party scripts or interceptors can safely attach
if (typeof window !== 'undefined') {
  try {
    const orig = window.fetch ? window.fetch.bind(window) : undefined;
    let _f = orig;
    const desc = {
      get() {
        return _f;
      },
      set(val: typeof window.fetch) {
        _f = val;
      },
      configurable: true,
      enumerable: true,
    };
    try {
      Object.defineProperty(window, 'fetch', desc);
    } catch {}
    if (typeof Window !== 'undefined' && Window.prototype) {
      try {
        Object.defineProperty(Window.prototype, 'fetch', desc);
      } catch {}
    }
  } catch {}
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
