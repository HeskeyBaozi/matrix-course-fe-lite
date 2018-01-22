import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { notification } from 'antd';
import { history } from '@/utils/history';
import {
  fetchAvatar, fetchUserLoginState, LoginBody, loginPost, LoginQueryResult,
  LoginErrorResult, LoginSuccessResult
} from '@/api/user';
import { CaptchaResult, fetchCaptcha } from '@/api/captcha';

export class LoginModel {
  @observable
  isLogin = false;

  @observable
  avatar = '';

  @observable
  captchaUrl = '';

  @observable
  notice = '';

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
    this.avatar = URL.createObjectURL(data);
  }

  @asyncAction
  * login(body: LoginBody) {
    const { data }: { data: LoginErrorResult | LoginSuccessResult } = yield loginPost(body);
    if (data.status === 'OK') {
      this.isLogin = true;
    }
    return data;
  }

  @asyncAction
  * captcha() {
    const { data }: { data: CaptchaResult } = yield fetchCaptcha();
    const svg = new Blob([ data.data.captcha ], { type: 'image/svg+xml' });
    this.captchaUrl = URL.createObjectURL(svg);
  }

}
