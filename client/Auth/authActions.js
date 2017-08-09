import axios from 'axios';

export const types = {
  AUTH_VERIFY: 'AUTH_VERIFY',
  AUTH_SUCCESS: 'AUTH_SUCCESS', 
  AUTH_FAIL: 'AUTH_FAIL', 
  USER_LOGGED_IN: 'USER_LOGGED_IN', 
  USER_LOGGED_OUT: 'USER_LOGGED_OUT', 
}

export function loginByToken(token) {
  return dispatch => {
    dispatch({ type: types.AUTH_VERIFY });

    localStorage.setItem('jwtToken', token);
    setAuthToken(token);

    return axios.get('/api/users/me').then(res => {

      dispatch({ type: types.AUTH_SUCCESS });
            
      const user = res.data.user;

      dispatch({ type: types.USER_LOGGED_IN, user});
      
    }).catch(err => {
      console.log(err);

      localStorage.removeItem('jwtToken');
      setAuthToken(null);
      dispatch({ type: types.AUTH_FAIL });

      throw err;
    });
  }
}

export function login(username, password) {
  return dispatch => {
    
    dispatch({ type: types.AUTH_VERIFY });
    
    return axios.post('/api/auth', { username, password } ).then(res => {
      const user = res.data.user;
      const token = res.data.token;

      localStorage.setItem('jwtToken', token);
      setAuthToken(token);
      
      dispatch({ type: types.AUTH_SUCCESS });
      dispatch({ type: types.USER_LOGGED_IN, user});
      
    }).catch(err => {
      console.log('Error', err);

      dispatch({ type: types.AUTH_FAIL });
      throw err;
    });
  }
}

export function logout() {
  return dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(null);
    dispatch({ type: types.USER_LOGGED_OUT });
  }
}

export function verifyAuth() {
  return dispatch => {

    dispatch({ type: types.AUTH_VERIFY});

    const token = localStorage.getItem('jwtToken');

    setAuthToken(token);

    
    
    return axios.get('/api/auth/verify').then(res => {

      dispatch({ type: types.AUTH_SUCCESS });

    }).catch(error => {

      console.log(error);

      localStorage.removeItem('jwtToken');
      setAuthToken(null);
      dispatch({ type: types.AUTH_FAIL });
      
    });
  }
}

function setAuthToken(token) {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
}