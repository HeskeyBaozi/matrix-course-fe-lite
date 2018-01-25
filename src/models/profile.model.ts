import { IProfile } from '@/api/interface';
import { fetchAvatar, fetchProfile } from '@/api/user';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class ProfileModel {
  @observable
  profile: IProfile = {
    email: '',
    homepage: null,
    is_valid: -1,
    nickname: '',
    phone: '',
    realname: '',
    user_addition: null,
    user_id: -1,
    username: ''
  };

  @observable
  avatarUrl = '';

  @computed
  get isProfileLoaded() {
    return this.profile.user_id !== -1;
  }

  @asyncAction
  * LoadProfile() {
    const { data: { data: profile } }: { data: { data: IProfile } } = yield fetchProfile();
    this.profile = profile;
    yield this.FetchUserAvatar({ username: this.profile.username });
  }

  @asyncAction
  * FetchUserAvatar({ username }: { username: string }) {
    const { data: avatarBlob }: { data: Blob } = yield fetchAvatar(username);
    this.avatarUrl = URL.createObjectURL(avatarBlob);
  }
}
