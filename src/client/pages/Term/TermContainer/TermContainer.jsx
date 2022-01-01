import React from 'react';

import { TermPage } from '../term/TermPage';
import { useDocumentTitle } from '../../../hooks/use_document_title';

/** @type {React.VFC} */
const TermContainer = () => {
  useDocumentTitle("利用規約 - CAwitter")
  return <TermPage />;
};

export { TermContainer };
