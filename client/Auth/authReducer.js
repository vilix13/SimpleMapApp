import { types } from './authActions';

const initialState = {
  isAuthenticated: false,
  user: {},
  isLoading: false,
};

export default (state = initialState, action = {}) => {
  switch(action.type) {

    case types.AUTH_VERIFY:
      console.log('reducer AUTH_VERIFY');
      return {
        ...state, isLoading: true
      };

    case types.AUTH_SUCCESS:
      return {
        ...state, 
        isLoading: false, 
        isAuthenticated: true
      };

    case types.AUTH_FAIL:
      return { 
        isAuthenticated: false,
        user: {},
        isLoading: false
      };

    case types.USER_LOGGED_IN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.user,
      };

    case types.USER_LOGGED_OUT:
      return {
        ...state,
        isAuthenticated: false,
        user: {}
      };

    default: return state;
  }
}
