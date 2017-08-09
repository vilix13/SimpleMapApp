var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    path.join(__dirname,'client/index.js')
  ],
  output: {
    path: path.join(__dirname,'/public/js'),
    publicPath: 'js/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader'],
        include: [
          path.join(__dirname,'/server/shared'),
          path.join(__dirname,'/client'),
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.(jpg|png|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 25000,
        },
      }
    ],
  },
  plugins: [],
};