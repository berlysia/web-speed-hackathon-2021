import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Root } from './root';
import { DocumentTitleContextProvider } from './hooks/use_document_title';

ReactDOM.render(
  <BrowserRouter>
    <DocumentTitleContextProvider>
      <Root />
    </DocumentTitleContextProvider>
  </BrowserRouter>,
  document.getElementById('app'),
);
