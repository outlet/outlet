import yn from 'yn';
import path from 'path';
import webpack from 'webpack';
import ExtractCssChunks from 'extract-css-chunks-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import { mapValues, keyBy, filter } from 'lodash';
import { _moduleAliases } from '../package.json';
import babelOpts from './client.babel.config';
import * as config from '../config';

const isDev = process.env.NODE_ENV === 'development';
const srcPath = path.resolve(__dirname, '..', 'src');
const { enableDynamicImports, clientEnv } = config;

if (isDev) require('dotenv').load();

export const isSSR = yn(process.env.SSR) || false;
export const analyzeBundle = yn(process.env.ANALYZE) || false;
export const basePlugins = {
  reactLoadablePlugin: new ReactLoadablePlugin({
    filename: path.join(srcPath, '..', 'react-loadable.json')
  }),
  extractCssChunksPlugin: new ExtractCssChunks({
    filename: isDev ? '[name].css' : '[name].[id].css',
    chunkFilename: '[id].css',
    hot: isDev ? true : false
  }),
  definePlugin: new webpack.DefinePlugin({
    'process.env': mapValues(keyBy(clientEnv), env => {
      return JSON.stringify(process.env[env]);
    })
  }),
  bundleAnalyzerPlugin: new BundleAnalyzerPlugin(),
  manifestPlugin: new ManifestPlugin({
    fileName: config.manifestFilename
  })
};

const allowedPlugin = (plugin, key) => {
  switch (key) {
    case 'reactLoadablePlugin':
      return enableDynamicImports;
    case 'bundleAnalyzerPlugin':
      return analyzeBundle;
    default:
      return true;
  }
};

// This function returns a loader set that will compile sass files from within
// the specified entry point.
// const scssLoaderForEntryPoint = (entry) => {
//   const test = new RegExp(path.resolve(cwd, `common/${entry}`) + '.+\\.scss');
//
//   return [
//     // These scss files will be converted into css-modules.
//     {
//       test: test,
//       exclude: [
//         path.resolve(cwd, 'node_modules'),
//         path.resolve(cwd, `common/${entry}/assets/css/base`)
//       ],
//       use: [
//         ExtractCssChunks.loader,
//         {
//           loader: 'css-loader',
//           options: {
//             modules: true,
//             minimize: false,
//             importLoaders: 1,
//             localIdentName: cssModulesIdentifier
//           }
//         },
//         { loader: 'postcss-loader' },
//         { loader: 'sass-loader' },
//         {
//           // allows resources like variables, colors to be available in
//           // css modules inside react components.
//           loader: 'sass-resources-loader',
//           options: {
//             resources: [
//               './common/shared/assets/css/resources/*.scss',
//               `./common/${entry}/assets/css/resources/*.scss`
//             ]
//           }
//         }
//       ]
//     },
//
//     // Some scss files should not be converted into css modules, since they
//     // should be applied globally.
//     {
//       test: test,
//       include: [
//         path.resolve(cwd, 'node_modules'),
//         path.resolve(cwd, `common/${entry}/assets/css/base/index.scss`)
//       ],
//       use: [
//         ExtractCssChunks.loader,
//         { loader: 'css-loader', options: { modules: false } },
//         { loader: 'postcss-loader' },
//         { loader: 'sass-loader' },
//         {
//           loader: 'sass-resources-loader',
//           options: {
//             resources: [
//               './common/shared/assets/css/resources/*.scss',
//               `./common/${entry}/assets/css/resources/*.scss`
//             ]
//           }
//         }
//       ]
//     }
//   ];
// };

export default {
  context: path.resolve(__dirname, '..', 'src'),
  mode: 'development',
  entry: {
    app: ['./app/index']
  },
  devServer: {
    stats: {
      colors: true,
      children: false
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: module => /node_modules/.test(module.context),
          name: 'vendor',
          chunks: chunk => chunk.name === 'app'
        }
      }
    }
  },
  output: {
    path: path.join(srcPath, '..', process.env.PUBLIC_OUTPUT_PATH),
    filename: '[name].js',
    publicPath: process.env.PUBLIC_ASSET_PATH || '/assets/',
    chunkFilename: enableDynamicImports ? '[name].js' : undefined
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
    alias: mapValues(_moduleAliases, aliasPath =>
      path.join(srcPath, ...aliasPath.split('/'))
    )
  },
  plugins: filter(basePlugins, allowedPlugin),
  module: {
    rules: [
      {
        test: /\.jsx$|\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: babelOpts
      },
      // ...scssLoaderForEntryPoint('app'),
      {
        test: /\.css$/,
        use: [ExtractCssChunks.loader, 'css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240
            }
          }
        ]
      },
      {
        // Load fonts using file-loader
        test: /\.(ttf|eot|woff2?)$/,
        loader: 'file-loader'
      }
    ]
  }
};
