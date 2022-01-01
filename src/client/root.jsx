import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppContainer } from './AppContainer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5000,
      refetchInterval: false,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

export function Root() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppContainer />
      </QueryClientProvider>
    </>
  );
}
