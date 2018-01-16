import { action, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchUserLoginState, LoginQueryResult } from '@/api/user';

'use strict';


export class LoginModel {
  @observable
  isLogin = false;

  @asyncAction
  * QueryLoginStatus() {
    const response = yield fetchUserLoginState();
    const { data } = response as { data: LoginQueryResult };
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
    console.log(data);
  }
}
