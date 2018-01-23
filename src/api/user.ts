import { xios } from '@/api/instance';
import { stringify } from 'qs';
import { LoginQueryResult, LoginBody, LoginResult, Profile, UpdateProfileBody } from '@/api/interface';


/******************************
 *           Login
 ******************************/

// https://api.vmatrix.org.cn/#/user/get_api_users_login
export function fetchUserLoginState() {
  return xios.get<LoginQueryResult>('/api/users/login');
}

// https://api.vmatrix.org.cn/#/user/post_api_users_login
export function loginPost(body: LoginBody) {
  return xios.post<LoginResult>('/api/users/login', body);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_logout
export function logoutPost() {
  return xios.post('/api/users/logout');
}


/******************************
 *           Profile
 ******************************/

// https://api.vmatrix.org.cn/#/user/get_api_users_profile
export function fetchProfile() {
  return xios.get<{ data: Profile }>(`/api/users/profile`);
}

// https://api.vmatrix.org.cn/#/user/post_api_users_profile
export function updateProfile(body: UpdateProfileBody, avatar: File) {

}

// https://api.vmatrix.org.cn/#/user/get_api_users_profile_avatar
export function fetchAvatar(username: string) {
  return xios.get<Blob>(`/api/users/profile/avatar?${stringify({ username })}`, { responseType: 'blob' });
}