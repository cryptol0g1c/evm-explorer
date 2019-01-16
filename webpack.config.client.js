const webpack = require('webpack');
const path = require('path');
const resolve = require('path').resolve;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './frontend/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/dist/'
  },
  watch: true,
  devtool: 'inline-source-map',
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ExtractTextPlugin('[name].[hash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'frontend/index.html')
    }),
    new LiveReloadPlugin(),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'frontend/assets', 'ethereum-logo.png'),
      to: path.join(__dirname, 'dist')
    }]),
    new CleanWebpackPlugin(['dist/*.css', 'dist/*.js'], {
      root: __dirname,
      verbose: false,
      watch: true
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          resolve(__dirname, 'frontend')
        ],
        options: {
          cacheDirectory: true,
          presets: [
            'es2015',
            'react',
            'stage-0'
          ]
        },
        loader: 'babel-loader'
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          use: [
            'css-loader?sourceMap',
            'sass-loader?sourceMapContents=true',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.(png|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: {
    alias: {},
    extensions: ['*', '.js', '.jsx', '.css', '.scss'],
    modules: [
      'src',
      'node_modules'
    ]
  }
};
