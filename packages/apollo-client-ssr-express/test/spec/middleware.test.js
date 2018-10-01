import React from 'react';
import path from 'path';
// import ClientServer from 'apollo-client-ssr-express';
import middleware from '../../src/middleware';
import express from 'express';
import request from 'supertest';
import http from 'http';
import { Helmet } from 'react-helmet';

const App = () => React.createElement('h1', {}, 'Hello, World!');

describe('ClientServer', () => {
  let app, server;

  beforeAll((done) => {
    app = express();
    app.use('*', middleware({
      routes: [
        { path: '/', component: App }
      ],
      AppComponent: App,
      graphqlUri: process.env.GRAPHQL_BASE_URL,
      manifestPath: path.join(
        __dirname,
        '..',
        '..',
        'webpack-manifest.json'
      )
    }));

    Helmet.canUseDOM = false;

    server = http.createServer(app);
    server.listen(done);
  });

  afterAll((done) => {
    server.close(done);
  });

  it('render properly', async () => {
    const response = await request(server).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toMatch(/Hello, World!/);
    expect(response.text).toMatch(/window.__APOLLO_STATE__ = {};/);
  });

});

// const isDev = getEnv('NODE_ENV', 'development') === 'development';
// const port = process.env.PORT || process.env.APPLICATION_PORT || 3001;
// const outputPath = process.env.PUBLIC_OUTPUT_PATH;
// const opts = {
//   enableDevTools: isDev,
//   devOptions: {
//     webpackConfig: isDev ? require('../../webpack/client.base').default : null
//   },
//   ssrOptions: {
//     routes,
//     templateFn,
//     AppComponent: App,
//     graphqlUri: process.env.GRAPHQL_BASE_URL,
//     manifestPath: path.join(
//       __dirname,
//       '..',
//       '..',
//       outputPath,
//       'webpack-manifest.json'
//     )
//   },
//   staticPath: '/assets',
//   staticPaths: [path.join(process.cwd(), '..', 'dist', 'public')]
// };
// const server = ClientServer(opts);
//
// server.listen(port, () => {
//   console.info(`Client application server mounted on port ${port}!`);
// });
