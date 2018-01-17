import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchAvatar, fetchUserLoginState, LoginQueryResult } from '@/api/user';

'use strict';


export class LoginModel {
  @observable
  isLogin = false;

  @observable
  avatar = '';

  @asyncAction
  * QueryLoginStatus() {
    yield new Promise(resolve => {
      setTimeout(() => {
        resolve();
      }, 3000);
    });
    const response = yield fetchUserLoginState();
    const { data } = response as { data: LoginQueryResult };
    if (data.status === 'OK') {
      this.isLogin = true;
    }
  }

  @asyncAction
  * FetchUserAvatar({ username }: { username: string }) {
    const response = yield fetchAvatar(username);
    const { data } = response as { data: Blob };
    this.avatar = URL.createObjectURL(data);
  }


}
