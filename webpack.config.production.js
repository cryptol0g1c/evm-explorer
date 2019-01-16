const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './frontend/index.js'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js',
    publicPath: '/dist/'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'frontend/index.html')
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, 'frontend/assets', 'ethereum-logo.png'),
      to: path.join(__dirname, 'dist')
    }])
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: 'babel-loader',
        include: __dirname,
        query: {
          presets: [
            'es2015',
            'react',
            'stage-0'
          ]
        }
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
