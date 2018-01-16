import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchUserLoginState, LoginQueryResult } from '@/api/user';

'use strict';


export class LoginModel {
  @observable
  isLogin = false;

  @asyncAction
  * QueryLoginStatus() {
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    const response = yield fetchUserLoginState();
    const { data } = response as { data: LoginQueryResult };
    if (data.status === 'OK') {
      this.isLogin = true;
    }
  }
}
