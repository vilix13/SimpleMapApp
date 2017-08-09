import { combineReducers } from "redux";
import { routerReducer } from "react-router-redux";

import authReducer from './Auth/authReducer';

export const reducers = combineReducers({
  routing: routerReducer,
  auth: authReducer
});