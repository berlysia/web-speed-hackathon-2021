const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');

const webpack = require('webpack');

const BabelClientConfig = require('./babel.client.config');

const SRC_PATH = path.resolve(__dirname, './src/client');
const PUBLIC_PATH = path.resolve(__dirname, './public');
const UPLOAD_PATH = path.resolve(__dirname, './upload');
const DIST_PATH = path.resolve(__dirname, './dist');

const IS_DEV = process.env.NODE_ENV === 'development';

/** @type {import('webpack').Configuration} */
const config = {
  devServer: {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: 8080,
    proxy: {
      '/api': 'http://localhost:3000',
    },
    static: [PUBLIC_PATH, UPLOAD_PATH],
  },
  devtool: IS_DEV ? 'inline-source-map' : false,
  entry: {
    main: {
      import: [
        path.resolve(SRC_PATH, './index.css'),
        path.resolve(SRC_PATH, './buildinfo.js'),
        path.resolve(SRC_PATH, './index.jsx'),
      ],
    },
    webfont: path.resolve(SRC_PATH, './styles/webfont.css'),
  },
  mode: 'none',
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.jsx?$/,
        use: [{ loader: 'babel-loader', options: BabelClientConfig }],
      },
      {
        test: /\.css$/i,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader', options: { url: false } },
          { loader: 'postcss-loader' },
        ],
      },
    ],
  },
  output: {
    filename: 'scripts/[name].[hash].js',
    chunkFilename: 'scripts/[name].[hash].js',
    publicPath: '/',
    path: DIST_PATH,
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      BUILD_DATE: new Date().toISOString(),
      // Heroku では SOURCE_VERSION 環境変数から commit hash を参照できます
      COMMIT_HASH: process.env.SOURCE_VERSION || '',
      NODE_ENV: 'development',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    // new HtmlWebpackPlugin({
    //   inject: false,
    //   template: path.resolve(SRC_PATH, './index.ejs'),
    // }),
    new WebpackManifestPlugin({
      filter: (file) => {
        if (file.name.match(/^webfont\.js$/)) return false;
        return true;
      },
    }),
    new LoadablePlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    fallback: {
      fs: false,
      path: false,
    },
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true,
      }),
    ],
    minimize: !IS_DEV,
    chunkIds: 'named',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        defaultVendors: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
      },
    },
  },
};

module.exports = config;