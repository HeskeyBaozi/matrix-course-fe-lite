import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { notification } from 'antd';
import { history } from '@/utils/history';
import {
  fetchAvatar, fetchUserLoginState, loginPost
} from '@/api/user';
import { CaptchaResult, fetchCaptcha } from '@/api/captcha';
import { LoginQueryResult, LoginBody, LoginResult } from '@/api/interface';

export class LoginModel {
  @observable
  isLogin = false;

  @observable
  avatarUrl = '';

  @observable
  captchaUrl = '';

  @asyncAction
  * QueryLoginStatus() {
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const { data }: { data: LoginQueryResult } = yield fetchUserLoginState();
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
  * Login(body: LoginBody) {
    const { data }: { data: LoginResult } = yield loginPost(body);
    if (data.status === 'OK') {
      this.isLogin = true;
    }
    return data;
  }

  @asyncAction
  * Captcha() {
    const { data }: { data: CaptchaResult } = yield fetchCaptcha();
    const svg = new Blob([ data.data.captcha ], { type: 'image/svg+xml' });
    this.captchaUrl = URL.createObjectURL(svg);
  }

}
