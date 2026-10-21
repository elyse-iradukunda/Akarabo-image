/**
 * Entry point.
 *
 * The providers are ordered from the outside in: React Query needs no
 * context of its own, the auth provider only needs the query client, and the
 * router needs the session to decide what to render.
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';
import './styles/theme.css';
import './styles/global.css';

/** Shared query client — every screen reads and writes through it. */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // One retry is enough — a second attempt only delays the error message.
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
});

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
