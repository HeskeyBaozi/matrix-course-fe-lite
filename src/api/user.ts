import { xios } from '@/api/instance';
import { stringify } from 'qs';


/******************************
 *           Login
 ******************************/

export interface LoginQueryResult {
  status: 'OK' | 'NOT_AUTHORIZED';
}

// https://api.vmatrix.org.cn/#/user/get_api_users_login
export function fetchUserLoginState() {
  return xios.get<LoginQueryResult>('/api/users/login');
}

export interface LoginBody {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginErrorResult {
  data: {
    captcha?: boolean;
  };
  status: 'WRONG_PASSWORD' | 'WRONG_CAPTCHA';
  msg: string;
}

export interface LoginSuccessResult {
  data: {
    realname: string;
  };
  status: 'OK';
  msg: string;
}

// https://api.vmatrix.org.cn/#/user/post_api_users_login
export function loginPost(body: LoginBody) {
  return xios.post<LoginErrorResult | LoginSuccessResult>('/api/users/login', body);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_logout
export function logoutPost() {
  return xios.post('/api/users/logout');
}

// https://api.vmatrix.org.cn/#/user/get_api_users_profile_avatar
export function fetchAvatar(username: string) {
  return xios.get<Blob>(`/api/users/profile/avatar?${stringify({ username })}`, { responseType: 'blob' });
}

/******************************
 *           Captcha
 ******************************/

export interface CaptchaResult {
  data: {
    captcha: string;
  }
}

// https://api.vmatrix.org.cn/#/captcha/get_api_captcha
export function fetchCaptcha() {
  return xios.get<CaptchaResult>(`/api/captcha`);
}
