import path from 'path';
import helmet from 'helmet';
import compression from 'compression';
import ssrMiddleware from 'apollo-ssr-middleware';
import routes from '@routes';
import App from '@containers/App';
import templateFn from './templates/app';
import getEnv from '@lib/getEnv';
import express from 'express';
import applyDevTools from '@libs/applyDevTools';

const isDev = getEnv('NODE_ENV', 'development') === 'development';
const publicPath = process.env.PUBLIC_OUTPUT_PATH;
const server = express();

if (isDev) {
  applyDevTools(server, {
    webpackConfig: require('@webpack/client.base').default
  });
}

server.use(helmet());
server.use(compression());

// serve built assets
server.use(
  '/assets',
  express.static(path.join(__dirname, '..', '..', publicPath))
);

server.use(
  '*',
  ssrMiddleware({
    routes,
    templateFn,
    AppComponent: App,
    graphqlUri: process.env.GRAPHQL_BASE_URL,
    manifestPath: path.join(
      __dirname,
      '..',
      '..',
      publicPath,
      'webpack-manifest.json'
    )
  })
);

export default server;
