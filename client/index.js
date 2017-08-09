import React from 'react';
import { render } from 'react-dom';
import { Router, useRouterHistory } from 'react-router';
import { Provider } from 'react-redux';

import { reduxHistory, store } from './store'
import routes from './routes';
import { loginByToken } from './Auth/authActions';

import mainStyle from './main.less';

if (localStorage.jwtToken) {
  store.dispatch(loginByToken(localStorage.jwtToken));
}

render(
  <Provider store={store}>
    <Router history={reduxHistory} routes={routes}/>
  </Provider>
  , document.getElementById('app')
);