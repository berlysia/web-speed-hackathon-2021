import ejs from 'ejs';
import path from 'path';
import Router from 'express-promise-router';
import { readFile } from 'fs/promises';
import { Comment, Post, User } from '../models';

async function readManifest() {
  const filepath = path.resolve(__dirname, '../../../dist/manifest.json');
  return await readFile(filepath, 'utf-8');
}

async function buildHeadTags() {
  const raw = await readManifest();
  const manifest = JSON.parse(raw);
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

async function handleSSR(headTags) {
  return ejs.renderFile(
    path.resolve(__dirname, '../../../client/src/index.ejs'),
    { headTags: headTags.join('\n') },
    {},
  );
}

async function handle(res, headTags) {
  res.type('text/html');
  try {
    const rendered = await handleSSR(headTags);
    res.send(rendered);
    res.status(200);
  } catch (e) {
    console.error(e);
    res.write(`
      <h1>Error</h1>
      <h2>${e.message}</h2>
      <code><pre>${e.stack}</pre></code>
    `);
    res.status(500);
  }
}

function buildPrefetched(key, value) {
  return `<script>window.__REACT_QUERY_PREFETCHED__[${JSON.stringify(key)}] = ${JSON.stringify(
    JSON.stringify(value),
  )};</script>`;
}

const router = Router();

router.get('/', async (req, res) => {
  const posts = await Post.findAll({
    limit: 10,
  });
  const headTags = await buildHeadTags();

  await handle(res, [buildPrefetched('/api/v1/posts', posts), ...headTags]);
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
  const headTags = await buildHeadTags();

  await handle(res, [
    buildPrefetched(`/api/v1/users/${req.params.username}`, user),
    buildPrefetched(`/api/v1/users/${req.params.username}/posts`, posts),
    ...headTags,
  ]);
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
  const headTags = await buildHeadTags();

  await handle(res, [
    buildPrefetched(`/api/v1/posts/${req.params.postId}`, post),
    buildPrefetched(`/api/v1/posts/${req.params.postId}/comments`, comments),
    ...headTags,
  ]);
  res.end();
});

router.get('/terms', async (_req, res) => {
  const headTags = await buildHeadTags();

  await handle(res, headTags);
  res.end();
});

export { router as ssrRouter };
