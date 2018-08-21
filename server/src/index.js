import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import ssrMiddleware from './middleware/ssr';
import applyDevTools from './lib/devTools';

export default function ClientServer(options = {}) {
  const opts = {
    enableDevTools: false,
    forceSSL: false,
    devOptions: {
      webpackConfig: {}
    },
    ssrOptions: {},
    manifestPath: null,
    staticPath: null,
    staticPaths: [],
    ...options
  };

  const server = new express();

  // Run with webpack-hot-client and webpack-dev-middleware for hot reloading
  if (opts.enableDevTools) {
    applyDevTools(server, opts.devOptions);
  }

  // Secure with helmet
  server.use(helmet());

  // parse cookies
  server.use(cookieParser());

  // gzip
  server.use(compression());

  // Add middleware to serve up all static files
  if (opts.staticPath) {
    server.use(
      opts.staticPath,
      ...opts.staticPaths.map(path => express.static(path))
    );
  }

  // Mount the react render middleware
  server.use('*', ssrMiddleware(opts.ssrOptions));

  return server;
}
