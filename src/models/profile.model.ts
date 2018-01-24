import { observable, computed } from 'mobx';
import { fetchProfile, fetchAvatar } from '@/api/user';
import { asyncAction } from 'mobx-utils';
import { Profile } from '@/api/interface';


export class ProfileModel {
  @observable
  profile: Profile = {
    email: '',
    homepage: null,
    is_valid: -1,
    nickname: '',
    phone: '',
    realname: '',
    username: '',
    user_addition: null,
    user_id: -1
  };

  @observable
  avatarUrl = '';

  @computed
  get isProfileLoaded() {
    return this.profile.user_id !== -1;
  }

  @asyncAction
  * LoadProfile() {
    const { data: { data: profile } }: { data: { data: Profile } } = yield fetchProfile();
    this.profile = profile;
    yield this.FetchUserAvatar({ username: this.profile.username });
  }

  @asyncAction
  * FetchUserAvatar({ username }: { username: string }) {
    const { data: avatarBlob }: { data: Blob } = yield fetchAvatar(username);
    this.avatarUrl = URL.createObjectURL(avatarBlob);
  }
}
