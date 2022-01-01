import React from 'react';
import loadable from '@loadable/component';
import { Route, Routes, useLocation } from 'react-router-dom';

import { AppPage } from '../components/application/AppPage';
import { useFetch } from '../hooks/use_fetch';
import { useDocumentTitle } from '../hooks/use_document_title';
import { fetchJSON } from '../utils/fetchers';
import AuthModalContainer from '../features/AuthModal/AuthModalContainer';
import NewPostModalContainer from '../features/NewPostModal/NewPostModalContainer';
const NotFoundContainer = loadable(() => import('../pages/NotFound/NotFoundContainer'));
const PostContainer = loadable(() => import('../pages/Post/PostContainer'));
const TermContainer = loadable(() => import('../pages/Term/TermContainer'));
const TimelineContainer = loadable(() => import('../pages/Timeline/TimelineContainer'));
const UserProfileContainer = loadable(() => import('../pages/UserProfile/UserProfileContainer'));

/** @type {React.VFC} */
const AppContainer = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const [activeUser, setActiveUser] = React.useState(null);
  const { data, isLoading } = useFetch('/api/v1/me', fetchJSON);
  React.useEffect(() => {
    setActiveUser(data ?? null);
  }, [data]);

  const [modalType, setModalType] = React.useState('none');
  const handleRequestOpenAuthModal = React.useCallback(() => setModalType('auth'), []);
  const handleRequestOpenPostModal = React.useCallback(() => setModalType('post'), []);
  const handleRequestCloseModal = React.useCallback(() => setModalType('none'), []);

  useDocumentTitle(isLoading && '読込中 - CAwitter');

  if (isLoading) {
    return null;
  }

  return (
    <>
      <AppPage
        activeUser={activeUser}
        onRequestOpenAuthModal={handleRequestOpenAuthModal}
        onRequestOpenPostModal={handleRequestOpenPostModal}
      >
        <Routes>
          <Route element={<TimelineContainer fallback={<div>loading...</div>} />} path="/" />
          <Route element={<UserProfileContainer fallback={<div>loading...</div>} />} path="/users/:username" />
          <Route element={<PostContainer fallback={<div>loading...</div>} />} path="/posts/:postId" />
          <Route element={<TermContainer fallback={<div>loading...</div>} />} path="/terms" />
          <Route element={<NotFoundContainer fallback={<div>loading...</div>} />} path="*" />
        </Routes>
      </AppPage>

      {modalType === 'auth' ? (
        <AuthModalContainer
          onRequestCloseModal={handleRequestCloseModal}
          onUpdateActiveUser={setActiveUser}
          fallback={<div>loading...</div>}
        />
      ) : null}
      {modalType === 'post' ? (
        <NewPostModalContainer onRequestCloseModal={handleRequestCloseModal} fallback={<div>loading...</div>} />
      ) : null}
    </>
  );
};

export { AppContainer };
