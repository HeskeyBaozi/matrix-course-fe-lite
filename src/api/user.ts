import axios from 'axios';
import { stringify } from 'qs';

// https://api.vmatrix.org.cn/#/user/get_api_users_login
export async function fetchUserLoginState() {
  return axios.get('/api/users/login');
}

export interface LoginBody {
  username: string;
  password: string;
  captcha?: string;
}

// https://api.vmatrix.org.cn/#/user/post_api_users_login
export async function login(body: LoginBody) {
  return axios.post('/api/users/login', body);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_logout
export async function logout() {
  return axios.post('/api/users/logout');
}

// https://api.vmatrix.org.cn/#/user/get_api_users_profile_avatar
export async function fetchAvatar(username: string) {
  return axios.get(`/api/users/profile/avatar?${stringify({ username })}`);
}
