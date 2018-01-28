import { fetchCaptcha } from '@/api/captcha';
import {
  fetchAvatar,
  fetchUserLoginState,
  loginPost
} from '@/api/user';
import {
  ICaptchaResult,
  ILoginBody,
  ILoginQueryResult,
  ILoginResult
} from '@/types/api';
import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class LoginModel {
  @observable
  isLogin = false;

  @observable
  avatarUrl = '';

  @observable
  captchaUrl = '';

  @asyncAction
  * QueryLoginStatus() {
    const { data }: { data: ILoginQueryResult } = yield fetchUserLoginState();
    if (data.status === 'OK') {
      this.isLogin = true;
    }
    return data;
  }

  @asyncAction
  * FetchUserAvatar({ username }: { username: string }) {
    const { data }: { data: Blob } = yield fetchAvatar(username);
    this.avatarUrl = URL.createObjectURL(data);
  }

  @asyncAction
  * Login(body: ILoginBody) {
    const { data }: { data: ILoginResult } = yield loginPost(body);
    if (data.status === 'OK') {
      this.isLogin = true;
      URL.revokeObjectURL(this.avatarUrl);
      URL.revokeObjectURL(this.captchaUrl);
    }
    return data;
  }

  @asyncAction
  * Captcha() {
    const { data }: { data: ICaptchaResult } = yield fetchCaptcha();
    const svg = new Blob([ data.data.captcha ], { type: 'image/svg+xml' });
    if (this.captchaUrl) {
      URL.revokeObjectURL(this.captchaUrl);
    }
    this.captchaUrl = URL.createObjectURL(svg);
  }
}
