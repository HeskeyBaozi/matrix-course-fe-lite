import axios from 'axios';
import { stringify } from 'qs';

export interface LoginQueryResult {
  status: 'OK' | 'NOT_AUTHORIZED';
}

// https://api.vmatrix.org.cn/#/user/get_api_users_login
export function fetchUserLoginState() {
  return axios.get<LoginQueryResult>('/api/users/login');
}

export interface LoginBody {
  username: string;
  password: string;
  captcha?: string;
}

// https://api.vmatrix.org.cn/#/user/post_api_users_login
export function loginPost(body: LoginBody) {
  return axios.post('/api/users/login', body);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_logout
export function logoutPost() {
  return axios.post('/api/users/logout');
}

// https://api.vmatrix.org.cn/#/user/get_api_users_profile_avatar
export function fetchAvatar(username: string) {
  return axios.get<Blob>(`/api/users/profile/avatar?${stringify({ username })}`, { responseType: 'blob' });
}
