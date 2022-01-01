import React from 'react';

import { InfiniteScroll } from '../../components/foundation/InfiniteScroll';
import { TimelinePage } from '../../components/timeline/TimelinePage';
import { useInfiniteFetch } from '../../hooks/use_infinite_fetch';
import { fetchJSON } from '../../utils/fetchers';
import { buildInitialDataForInfinite } from '../../utils/buildInitialData';
import { useDocumentTitle } from '../../hooks/use_document_title';

/** @type {React.VFC} */
const TimelineContainer = () => {
  const { data: posts, fetchMore } = useInfiniteFetch('/api/v1/posts', fetchJSON, {
    ...buildInitialDataForInfinite('/api/v1/posts'),
  });

  useDocumentTitle('タイムライン - CAwitter');

  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>
      <TimelinePage timeline={posts} />
    </InfiniteScroll>
  );
};

export { TimelineContainer };
