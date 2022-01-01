import React from 'react';

import { NotFoundPage } from '../../components/application/NotFoundPage';
import { useDocumentTitle } from '../../hooks/use_document_title';

/** @type {React.VFC} */
const NotFoundContainer = () => {
  useDocumentTitle('ページが見つかりません - CAwitter');
  return <NotFoundPage />;
};

export { NotFoundContainer };
