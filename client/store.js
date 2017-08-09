import { createStore, applyMiddleware, compose } from "redux";
import { createHistory } from 'history'
import { syncHistoryWithStore, routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import freeze from "redux-freeze";
import { reducers } from "./reducers.js";

let middlewares = [];

const history = createHistory();

middlewares.push(routerMiddleware(history));

middlewares.push(thunk);

if (process.env.NODE_ENV !== 'prod') {
  middlewares.push(freeze);
}

let middleware = applyMiddleware(...middlewares);

if (process.env.NODE_ENV !== 'prod' && window.devToolsExtension) {
  middleware = compose(middleware, window.devToolsExtension());
}

const store = createStore(reducers, middleware);
const reduxHistory = syncHistoryWithStore(history, store);

export { store, reduxHistory };