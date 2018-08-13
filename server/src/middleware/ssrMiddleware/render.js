import { Helmet } from 'react-helmet';
import not from '../../lib/not';

const isVendor = f => f.match(/vendor/);
const isCss = f => f.match(/.css/);
const isJs = f => f.match(/.js/);

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

export default function render(html, opts = {}) {
  const { manifest, templateFn, bundles, state, styles } = opts;
  const assets = getAssets(manifest, bundles);
  const helmet = Helmet.renderStatic();

  return templateFn({
    html,
    helmet,
    assets,
    state,
    styles
  });
}
