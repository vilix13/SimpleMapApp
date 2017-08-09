import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './App/App';
import About from './App/About';
import Map from './Map/Map';
import Auth from './Auth/Auth';
import requireAuth from './utils/requireAuth';


export default (
  <Route path="/" component={App}>
    <IndexRoute component={requireAuth(Map)}/>
    <Route path="login" component={Auth} />
    <Route path="about" component={About} />
  </Route>
);