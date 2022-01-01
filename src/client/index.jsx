import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { loadableReady } from '@loadable/component';

import { Root } from './root';
import { DocumentTitleContextProvider } from './hooks/use_document_title';

const dehydratedState = window.__REACT_QUERY_STATE__;

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

loadableReady(() => {
  ReactDOM.hydrate(
    <BrowserRouter>
      <DocumentTitleContextProvider>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={dehydratedState}>
            <Root />
          </Hydrate>
        </QueryClientProvider>
      </DocumentTitleContextProvider>
    </BrowserRouter>,
    document.getElementById('app'),
  );
});
