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



/******************************
 *           Profile
 ******************************/

// https://api.vmatrix.org.cn/#/user/get_api_users_profile

export interface Profile {
  email: string;
  homepage: string | null;
  is_valid: number;
  nickname: string;
  phone: string;
  realname: string;
  user_addition: null | object;
  user_id: number;
}

export function fetchProfile() {
  return xios.get<{ data: Profile }>(`/api/users/profile`);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_profile

export interface UpdateProfileBody {
  email?: string | null;
  phone?: string | null;
  homepage?: string | null;
  nickname?: string | null;
}

export function updateProfile(body: UpdateProfileBody, avatar: File) {

}

// https://api.vmatrix.org.cn/#/user/get_api_users_profile_avatar
export function fetchAvatar(username: string) {
  return xios.get<Blob>(`/api/users/profile/avatar?${stringify({ username })}`, { responseType: 'blob' });
}