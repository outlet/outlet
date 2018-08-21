import path from 'path';
import ClientServer from 'apollo-client-ssr-express';
import routes from '@routes';
import App from '@containers/App';
import templateFn from './templates/app';
import getEnv from '@lib/getEnv';

const isDev = getEnv('NODE_ENV', 'development') === 'development';
const port = process.env.PORT || process.env.APPLICATION_PORT || 3001;
const outputPath = process.env.PUBLIC_OUTPUT_PATH;
const server = ClientServer({
  enableDevTools: isDev,
  devOptions: {
    webpackConfig: isDev ? require('../../webpack/client.base').default : null
  },
  ssrOptions: {
    routes,
    templateFn,
    AppComponent: App,
    graphqlUri: process.env.GRAPHQL_BASE_URL,
    manifestPath: path.join(
      __dirname,
      '..',
      '..',
      outputPath,
      'webpack-manifest.json'
    )
  },
  staticPath: '/assets',
  staticPaths: [path.join(process.cwd(), '..', 'dist', 'public')]
});

server.listen(port, () => {
  console.info(`Client application server mounted on port ${port}!`);
});
