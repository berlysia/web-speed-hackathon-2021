import ejs from 'ejs';
import path from 'path';
import Router from 'express-promise-router';
import { readFile } from 'fs/promises';
import { Comment, Post, User } from '../models';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { ChunkExtractor } from '@loadable/server';
import { Root } from '../../client/root';
import { dehydrate, Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { wrapFetcherAsInfinite } from '../../client/hooks/use_infinite_fetch';

async function readManifest() {
  const filepath = path.resolve(__dirname, '../../../dist/manifest.json');
  return JSON.parse(await readFile(filepath, 'utf-8'));
}

const statsFile = path.resolve(__dirname, '../../../dist/loadable-stats.json');

async function buildHeadTags() {
  const manifest = await readManifest();
  const js = [];
  const css = [];
  // const lazyCss = [];
  for (const [name, url] of Object.entries(manifest)) {
    if (name.endsWith('.js')) js.push(url);
    if (name.endsWith('.css')) css.push(url);
  }
  return [
    ...js.map((p) => `<script defer src="${p}"></script>`),
    ...css.map((p) => `<link rel="stylesheet" href="${p}" />`),
    // ...lazyCss.map(
    //   (p) =>
    //     `<link rel="prefetch" href="${p}" as="stylesheet" /><script defer>setTimeout(()=>{const t=document.createElement("link");t.as="style";t.rel="stylesheet";t.href="${p}";setTimeout(()=>document.head.append(t),0)},0)</script>`,
    // ),
  ];
}

function setup() {
  const queryClient = new QueryClient();

  return {
    queryClient,
    async renderHTML(url, headTags) {
      const extractor = new ChunkExtractor({ statsFile });
      const dehydratedState = dehydrate(queryClient);
      const appHtml = renderToString(
        extractor.collectChunks(
          <StaticRouter location={url}>
            <QueryClientProvider client={queryClient}>
              <Hydrate state={dehydratedState}>
                <Root />
              </Hydrate>
            </QueryClientProvider>
          </StaticRouter>,
        ),
      );

      return await ejs.renderFile(
        path.resolve(__dirname, '../../client/index.ejs'),
        {
          headTags: extractor.getScriptTags() + headTags.join('\n') + extractor.getLinkTags(),
          appHtml,
          dehydratedState,
        },
        {},
      );
    },
  };
}

const router = Router();

router.get('/', async (req, res) => {
  const { queryClient, renderHTML } = setup();
  const posts = await Post.findAll({
    limit: 10,
  });
  await Promise.all([
    queryClient.prefetchInfiniteQuery(
      '/api/v1/posts',
      wrapFetcherAsInfinite(() => posts),
    ),
  ]);
  const headTags = await buildHeadTags();

  res.type('text/html');
  res.send(await renderHTML(req.url, headTags));
  res.end();
});

router.get('/users/:username', async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username,
    },
  });
  if (user === null) {
    throw new httpErrors.NotFound();
  }

  const posts = await Post.findAll({
    limit: req.query.limit,
    offset: req.query.offset,
    where: {
      userId: user.id,
    },
  });

  const { queryClient, renderHTML } = setup();
  await Promise.all([
    queryClient.prefetchQuery(`/api/v1/users/${req.params.username}`, () => user),
    queryClient.prefetchInfiniteQuery(
      `/api/v1/users/${req.params.username}/posts`,
      wrapFetcherAsInfinite(() => posts),
    ),
  ]);
  const headTags = await buildHeadTags();

  res.type('text/html');
  res.send(await renderHTML(req.url, headTags));
  res.end();
});

router.get('/posts/:postId', async (req, res) => {
  const [post, comments] = await Promise.all([
    Post.findByPk(req.params.postId),
    Comment.findAll({
      limit: 10,
      where: {
        postId: req.params.postId,
      },
    }),
  ]);

  const { queryClient, renderHTML } = setup();
  await Promise.all([
    queryClient.prefetchQuery(`/api/v1/posts/${req.params.postId}`, () => post),
    queryClient.prefetchInfiniteQuery(
      `/api/v1/posts/${req.params.postId}/comments`,
      wrapFetcherAsInfinite(() => comments),
    ),
  ]);
  const headTags = await buildHeadTags();

  res.type('text/html');
  res.send(await renderHTML(req.url, headTags));
  res.end();
});

router.get('/terms', async (req, res) => {
  const { renderHTML } = setup();
  const headTags = await buildHeadTags();

  res.type('text/html');
  res.send(await renderHTML(req.url, headTags));
  res.end();
});

export { router as ssrRouter };
