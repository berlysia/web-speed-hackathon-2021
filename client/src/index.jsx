import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from 'react-query';

import { AppContainer } from './AppContainer';
import { DocumentTitleContextProvider } from './hooks/use_document_title';

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

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <DocumentTitleContextProvider>
        <AppContainer />
      </DocumentTitleContextProvider>
    </BrowserRouter>
  </QueryClientProvider>,
  document.getElementById('app'),
);
