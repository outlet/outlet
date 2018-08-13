import path from 'path';
import ClientServer from '@outlet/server';
import routes from '@routes';
import App from '@containers/App';
import webpackConfig from '../../webpack/base.client';

const port = process.env.PORT || process.env.APPLICATION_PORT || 3001;
const template = require('./templates/app.html');
const manifest = require('../../dist/public/webpack-manifest.json');
const server = ClientServer({
  enableDevTools: true,
  devOptions: {
    webpackConfig
  },
  ssrOptions: {
    routes,
    AppComponent: App,
    graphqlUri: process.env.GRAPHQL_BASE_URL,
    template,
    webpackManifest: manifest
  },
  staticPath: '/assets',
  staticPaths: [
    path.join(process.cwd(), '..', 'dist', 'public')
  ]
});

server.listen(port, () => {
  console.info(`Client application server mounted on port ${port}!`);
});
