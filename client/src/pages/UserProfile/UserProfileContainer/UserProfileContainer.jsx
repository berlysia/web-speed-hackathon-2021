import React from 'react';
import { useParams } from 'react-router-dom';

import { InfiniteScroll } from '../../../components/foundation/InfiniteScroll';
import { UserProfilePage } from '../../../pages/UserProfile/user_profile/UserProfilePage';
import { useFetch } from '../../../hooks/use_fetch';
import { useInfiniteFetch } from '../../../hooks/use_infinite_fetch';
import { fetchJSON } from '../../../utils/fetchers';
import { buildInitialData, buildInitialDataForInfinite } from '../../../utils/buildInitialData';
import NotFoundContainer from '../../NotFound/NotFoundContainer';
import { useDocumentTitle } from '../../../hooks/use_document_title';

/** @type {React.VFC} */
const UserProfileContainer = () => {
  const { username } = useParams();

  const { data: user, isLoading: isLoadingUser } = useFetch(`/api/v1/users/${username}`, fetchJSON, {
    ...buildInitialData(`/api/v1/users/${username}`),
  });
  const { data: posts, fetchMore } = useInfiniteFetch(`/api/v1/users/${username}/posts`, fetchJSON, {
    ...buildInitialDataForInfinite(`/api/v1/users/${username}/posts`),
  });

  useDocumentTitle(isLoadingUser ? "読込中 - CAwitter" : user ? `${user.name} さんのタイムライン - CAwitter` : null)

  if (isLoadingUser) {
    return null;
  }

  if (user === null) {
    return <NotFoundContainer />;
  }

  return (
    <InfiniteScroll fetchMore={fetchMore} items={posts}>
      <UserProfilePage timeline={posts} user={user} />
    </InfiniteScroll>
  );
};

export { UserProfileContainer };
