var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack-hot-middleware/client',
    path.join(__dirname,'client/index.js'),
  ],
  output: {
    path: path.join(__dirname,'/public/js'),
    publicPath: 'http://localhost:3000/js/',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['react-hot-loader','babel-loader'],
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
  plugins: [
    new webpack.HotModuleReplacementPlugin()
    ],  
};