import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import {
  CaptchaResult,
  fetchAvatar, fetchCaptcha, fetchUserLoginState, LoginBody, loginPost, LoginQueryResult,
  LoginResult
} from '@/api/user';

'use strict';


export class LoginModel {
  @observable
  isLogin = false;

  @observable
  avatar = '';

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
  }

  @asyncAction
  * FetchUserAvatar({ username }: { username: string }) {
    const { data }: { data: Blob } = yield fetchAvatar(username);
    this.avatar = URL.createObjectURL(data);
  }

  @asyncAction
  * login(body: LoginBody) {
    const { data }: { data: LoginResult } = yield loginPost(body);
    if (data.data.captcha) {
      yield this.captchaFlow();
    }
  }

  @asyncAction
  * captchaFlow() {
    const { data }:{ data: CaptchaResult } = yield fetchCaptcha();
    const svg = new Blob([data.data.captcha], { type: 'image/svg+xml' });
    this.captchaUrl = URL.createObjectURL(svg);
  }


}
