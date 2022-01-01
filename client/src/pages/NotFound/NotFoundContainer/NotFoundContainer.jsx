import React from 'react';
import { useDocumentTitle } from '../../../hooks/use_document_title';

import { NotFoundPage } from '../NotFoundPage';

/** @type {React.VFC} */
const NotFoundContainer = () => {
  useDocumentTitle('ページが見つかりません - CAwitter');
  return <NotFoundPage />;
};

export { NotFoundContainer };
