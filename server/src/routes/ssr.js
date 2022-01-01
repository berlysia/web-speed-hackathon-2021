import ejs from 'ejs';
import path from 'path';
import Router from 'express-promise-router';
import { readFile } from 'fs/promises';

async function readManifest() {
  const filepath = path.resolve(__dirname, '../../../dist/manifest.json');
  return await readFile(filepath, "utf-8");
}

async function buildHeadTags() {
  const raw = await readManifest();
  const manifest = JSON.parse(raw);
  const js = [], css = [];
  for (const [name, url] of Object.entries(manifest)) {
    if (name.endsWith(".js")) js.push(url);
    if (name.endsWith(".css")) css.push(url);
  }
  return [
    ...js.map(p => `<script defer src="${p}"></script>`),
    ...css.map(p => `<link rel="stylesheet" href="${p}" />`)
  ].join("\n")
}

async function handleSSR(req) {

  const headTags = await buildHeadTags();

  return ejs.renderFile(
    path.resolve(__dirname, '../../../client/src/index.ejs'),
    { headTags },
    {},
  );
}

async function handle(req, res) {
  res.type('text/html');
  try {
    const rendered = await handleSSR(req);
    res.send('<!DOCTYPE html>' + rendered);
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
  res.end();
}

const router = Router();

for (const route of ['/', '/users/:username', '/posts/:postId', '/terms', '*']) {
  router.get(route, handle);
}

export { router as ssrRouter };
