import React from 'react';
import { useParams } from 'react-router-dom';

import { InfiniteScroll } from '../../../components/foundation/InfiniteScroll';
import { PostPage } from '../../../components/post/PostPage';
import { useFetch } from '../../../hooks/use_fetch';
import { useInfiniteFetch } from '../../../hooks/use_infinite_fetch';
import { fetchJSON } from '../../../utils/fetchers';
import { buildInitialData, buildInitialDataForInfinite } from '../../../utils/buildInitialData';
import { NotFoundContainer } from '../../NotFound/NotFoundContainer';
import { useDocumentTitle } from '../../../hooks/use_document_title';

/** @type {React.VFC} */
const PostContainer = () => {
  const { postId } = useParams();

  const { data: post, isLoading: isLoadingPost } = useFetch(`/api/v1/posts/${postId}`, fetchJSON, {
    ...buildInitialData(`/api/v1/posts/${postId}`),
  });

  const { data: comments, fetchMore } = useInfiniteFetch(`/api/v1/posts/${postId}/comments`, fetchJSON, {
    ...buildInitialDataForInfinite(`/api/v1/posts/${postId}/comments`),
  });

  useDocumentTitle(isLoadingPost ? '読込中 - CAwitter' : post ? `${post.user.name} さんのつぶやき - CAwitter` : null);

  if (isLoadingPost) {
    return null;
  }

  if (post === null) {
    return <NotFoundContainer />;
  }

  return (
    <InfiniteScroll fetchMore={fetchMore} items={comments}>
      <PostPage comments={comments} post={post} />
    </InfiniteScroll>
  );
};

export { PostContainer };
