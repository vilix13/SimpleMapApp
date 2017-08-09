import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import webpack from 'webpack';
import mongoose from 'mongoose';

import config from './config';

import users from './routes/users';
import auth from './routes/auth';

const app = express();

app.use(bodyParser.json());

mongoose.Promise = global.Promise;
mongoose.connect(config.mongouri);

app.use('/api/users', users);
app.use('/api/auth', auth);

console.log("ENV", process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev') {
  const webpackConfig = require('../webpack.config.dev');
  const webpackMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const compiler = webpack(webpackConfig);

  app.use(webpackMiddleware(compiler, {
    hot: true,
    publicPath: webpackConfig.output.publicPath,
    noInfo: true
  }));
  app.use(webpackHotMiddleware(compiler));

  app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  app.listen(3000, () => console.log('Running hot on localhost:3000'));

} else if (process.env.NODE_ENV === 'prod') {
  const webpackConfig = require('../webpack.config.prod');
  
  const compiler = webpack(webpackConfig);

  compiler.run(err => {
    if (err) return console.log(err);

    app.use('/', express.static(path.join(__dirname, '../public')));

    app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    app.listen(3000, () => console.log('Running prod on localhost:3000'));
  })
}