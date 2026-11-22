import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import App from '@/App';
import { queryClient } from '@/lib/queryClient';
import '@/index.css';
import { BranchProvider } from '@/context/BranchContext';
import { RealtimeProvider } from '@/context/RealtimeProvider';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BranchProvider>
          <RealtimeProvider>
            <App />
          </RealtimeProvider>
        </BranchProvider>
        <Toaster
          richColors
          closeButton
          position="bottom-right"
          offset={24}
          mobileOffset={{ bottom: 88 }}
          toastOptions={{
            classNames: {
              toast: 'font-sans rounded-xl border-espresso-100',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
