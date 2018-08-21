import React from 'react';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { createHttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { StaticRouter } from 'react-router';
import { getBundles } from 'react-loadable/webpack';
import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import { Helmet } from 'react-helmet';
import fetch from 'node-fetch';
import Loadable from 'react-loadable';
import matchRoutes from '../lib/matchRoutes';
import not from '../lib/not';

const isVendor = f => f.match(/vendor/);
const isCss = f => f.match(/.css/);
const isJs = f => f.match(/.js/);
const safeRequire = function(modulePath) {
  try {
    return require(modulePath);
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return undefined;
    }
    else throw err;
  }
};

const defaultTemplate = ({ helmet, assets, styles, state, html }) => {
  const { js, css } = assets;
  const sheets = f => `<link type="text/css" rel="stylesheet" href="${f}" />`;
  const scripts = f => `<script src="${f}"></script>`;
  const apolloState = JSON.stringify(state).replace(/</g, '\\u003c');

  return `<!doctype html>
<html>
<head>
  ${helmet.title}
  <link rel="shortcut icon" type="image/x-icon" href="/assets/favicon.png">
  ${css.map(sheets).join('\n  ')}
  ${styles}
</head>
<body>
  <div id="app">${html}</div>
  <script>window.__APOLLO_STATE__ = ${apolloState};</script>
  ${js.map(scripts).join('\n  ')}
</body>
</html>`;
};

const getAssets = (manifest, chunks = []) => {
  const assetPath = k => manifest[k];
  const keys = Object.keys(manifest);
  const chunkPaths = chunks.map(chunk => chunk.file);
  const assets = keys
    .filter(isVendor)
    .concat(keys.filter(not(isVendor)))
    .map(assetPath);

  return {
    css: assets.filter(isCss).concat(chunkPaths.filter(isCss)),
    js: assets.filter(isJs).concat(chunkPaths.filter(isJs))
  };
};

const render = function(html, opts = {}) {
  const { manifest, templateFn, bundles, state, styles } = opts;
  const assets = getAssets(manifest, bundles);
  const helmet = Helmet.renderStatic();

  return (typeof templateFn === 'function' ? templateFn : defaultTemplate)({
    html,
    helmet,
    assets,
    state,
    styles
  });
};

/**
 * Returns a middleware function that can handle the rendering of React
 * components
 * @param  {Object}  options                     The rendering options.
 * @param  {Array}   options.routes              An array of react-router routes
 * @param  {Object}  options.AppComponent        Top level react component to
 *                                               render
 * @param  {Object}  options.apolloClientOptions Override the default
 *                                               apollo-client options.
 * @param  {Boolean} options.ssr                 Turn SSR on/off.
 * @param  {Object}  options.reactLoadableStats  If supplied, enables dynamic
 *                                               imports with react-loadable
 * @param  {Object}  options.graphqlUri          The URI to the GraphQL endpoint
 *                                               to connect to.
 * @param  {Object}  options.manifestPath        Path to asset manifest file
 *                                               from webpack. If supplied and
 *                                               the file exists, an `assets`
 *                                               object will be supplied to
 *                                               `templateFn` when rendering.
 * @param  {Object}  options.templateFn          A function that returns a
 *                                               template literal to render the
 *                                               base layout.
 *                                               If not provided, this will be
 *                                               rendered using the default
 *                                               template. The function will be
 *                                               called with the following
 *                                               object arguments:
 *                                               {
 *                                                 helmet,
 *                                                 assets,
 *                                                 styles,
 *                                                 state,
 *                                                 html
 *                                               }
 *
 * @return {Function} A middleware function that handles rendering of React
 * components.
 */
export default function ssrMiddleware(options = {}) {
  const opts = {
    routes: [],
    AppComponent: null,
    templateFn: null,
    apolloClientOptions: {},
    ssr: true,
    reactLoadableStats: null,
    manifestPath: null,
    graphqlUri: null,
    ...options
  };

  return function handleRender(req, res) {
    const { AppComponent } = opts;

    let context = {},
      modules = [];

    // Set the content type to HTML since this is an HTML renderer.
    res.contentType('text/html');

    // Check for matched routes against the baseUrl of the request.
    const matches = matchRoutes(req.baseUrl, opts.routes);

    // If there are no matched routes, respond with an error.
    // TODO: Respond with a 404 error/component instead.
    if (!matches.length) {
      return res.status(404).send('Not Found');
    }

    const status = matches.length && matches[0].match.path === '*' ? 404 : 200;
    const [pathname, search] = req.originalUrl.split('?');
    const location = { pathname, search };

    // If SSR is disabled, just render the skeleton HTML with the initial state.
    if (!opts.ssr) {
      return res.status(status).send(render(null, opts, {}, []));
    }

    const client = new ApolloClient({
      ssrMode: opts.ssr,
      cache: new InMemoryCache(),
      link: createHttpLink({
        fetch,
        uri: opts.graphqlUri,
        credentials: 'include',
        headers: {
          cookie: req.header('Cookie')
        }
      }),
      ...opts.apolloClientOptions
    });

    let App = (
      <ApolloProvider client={client}>
        <StaticRouter context={context} location={location}>
          <AppComponent />
        </StaticRouter>
      </ApolloProvider>
    );

    // If react-loadable stats manifest is supplied, then
    if (opts.reactLoadableStats) {
      App = (
        <Loadable.Capture report={name => modules.push(name)}>
          {App}
        </Loadable.Capture>
      );
    }

    const renderApp = () => {
      // A 301 redirect was rendered somewhere if context.url exists after
      // rendering has happened.
      if (context.url) {
        return res.redirect(302, context.url);
      }

      const { reactLoadableStats: stats, manifestPath, templateFn } = opts;
      const manifest = safeRequire(manifestPath) || {};
      const sheet = new ServerStyleSheet();
      const html = renderToString(sheet.collectStyles(App));
      const markup = render(html, {
        bundles: (stats && getBundles(stats, modules)) || [],
        state: client.extract(),
        styles: sheet.getStyleTags(),
        manifest,
        templateFn
      });

      return res.status(status).send(markup);
    };

    return getDataFromTree(App)
      .then(renderApp)
      .catch(renderApp);
  };
}
