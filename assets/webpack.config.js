const path = require('path')
const glob = require('glob')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = (env, options) => {
  const devMode = options.mode !== 'production'

  return {
    optimization: {
      minimizer: [
        new TerserPlugin({ cache: true, parallel: true, sourceMap: devMode }),
        new OptimizeCSSAssetsPlugin({}),
      ],
    },
    entry: {
      app: glob.sync('./vendor/**/*.js').concat(['./js/app.js']),
      ws: glob.sync('./vendor/**/*.js').concat(['./js/socket.js']),
      gql: glob.sync('./vendor/**/*.js').concat(['./js/gql.tsx']),
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '../priv/static/js'),
      publicPath: '/js/',
    },
    devtool: devMode ? 'eval-cheap-module-source-map' : undefined,
    resolve: {
      extensions: ['.mjs', '.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.[s]?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({ filename: '../css/app.css' }),
      new CopyWebpackPlugin([{ from: 'static/', to: '../' }]),
    ].concat(devMode ? [new HardSourceWebpackPlugin()] : []),
  }
}
