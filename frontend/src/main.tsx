import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ThemeProvider } from './providers/Theme.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { SettingsProvider } from './providers/Settings.tsx';
import { AuthProvider } from './providers/Auth.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import LazyLoad from './components/LazyLoad.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <HelmetProvider >
    <BrowserRouter>
      <SettingsProvider>
        <ThemeProvider>
          <Toaster />
          <Suspense fallback={<LazyLoad/>}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </Suspense>
        </ThemeProvider>
      </SettingsProvider>
    </BrowserRouter>
  </HelmetProvider>,
);
