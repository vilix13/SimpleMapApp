import axios from 'axios';

export function userCreateRequest(userData) {
  return dispatch => {
    return axios.post('/api/users', userData);
  }
}