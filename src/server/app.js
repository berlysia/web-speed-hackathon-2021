import bodyParser from 'body-parser';
import Express from 'express';
import session from 'express-session';

import { apiRouter } from './routes/api';
import { staticRouter } from './routes/static';
import compression from 'compression';
import { ssrRouter } from './routes/ssr';

const app = Express();

app.use(compression());

app.set('trust proxy', true);

app.use(
  session({
    proxy: true,
    resave: false,
    saveUninitialized: false,
    secret: 'secret',
  }),
);
app.use(bodyParser.json());
app.use(bodyParser.raw({ limit: '10mb' }));

const staticfiles = ['/movies/', '/fonts/', '/images/', '/sounds/', '/sprites/'];

app.use((req, res, next) => {
  if (req.method === 'GET' && staticfiles.some((x) => req.path.startsWith(x))) {
    res.header({
      'Cache-Control': 'public, max-age=86400, immutable',
    });
  } else {
    res.header({
      'Cache-Control': 'max-age=0',
    });
  }
  return next();
});

app.use('/api/v1', apiRouter);
app.use(ssrRouter);
app.use(staticRouter);

export { app };
