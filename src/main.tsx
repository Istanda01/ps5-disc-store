import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ApiError } from './api/games';
import { createAppRouter } from './router';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (count, error) => !(error instanceof ApiError && error.status === 404) && count < 1,
      refetchOnWindowFocus: false,
      gcTime: 30 * 60 * 1000
    }
  }
});

const root = document.getElementById('root');
if (!root) throw new Error('Missing root element');
ReactDOM.createRoot(root).render(
  <React.StrictMode><QueryClientProvider client={queryClient}><RouterProvider router={createAppRouter()} /></QueryClientProvider></React.StrictMode>
);
