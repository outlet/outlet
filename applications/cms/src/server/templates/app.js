/* eslint-disable max-len */
export default ({ helmet, assets, styles, state, html }) => {
  const { js, css } = assets;
  const scripts = js.map(f => `  <script src="${f}"></script>`).join('\n');
  const sheets = css.map(f => `  <link type="text/css" rel="stylesheet" href="${f}" />`).join('\n');

  return `<!doctype html>
<html>
<head>
  ${helmet.title}
  <meta charset="utf-8" />
  <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width height=device-height" />
  <link rel="shortcut icon" type="image/x-icon" href="/assets/favicon.png">
  ${sheets}
  ${styles}
</head>
<body>
  <div id="app">${html}</div>
  <script>window.__APOLLO_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')};</script>
  ${scripts}
</body>
</html>`;
};
/* eslint-enable max-len */
