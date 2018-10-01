import hotClient from 'webpack-hot-client';
import devMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';

/* This module sets up the development environment for our server.
 * This is and should only be loaded in development ONLY:
 *
 * - Attaches webpack-hot-client
 * - Attaches webpack-dev-middleware to express for hot reloads
 */

export default function applyDevTools(server, options = {}) {
  const opts = {
    webpackConfig: {},
    hotClientOptions: {
      allEntries: true,
    },
    devMiddlewareOptions: null,
    ...options
  };

  if (!opts.webpackConfig) {
    throw new Error('A webpack configuration must be provided.');
  }

  const devMiddlewareOptions = opts.devMiddlewareOptions || {
    publicPath: options.webpackConfig.output.publicPath,
    writeToDisk: true,
    stats: { color: true, children: false }
  };

  const compiler = webpack(opts.webpackConfig);

  // Set up hot reloading with WebSockets
  const client = hotClient(compiler, opts.hotClientOptions);

  // Add dev middleware to our express app once hot client is up
  client.server.on('listening', () => {
    return server.use(devMiddleware(compiler, devMiddlewareOptions));
  });
}
