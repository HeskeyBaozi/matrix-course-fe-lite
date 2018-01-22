import { observable } from 'mobx';
import { Profile, fetchProfile } from '@/api/user';
import { asyncAction } from 'mobx-utils';



export class ProfileModel {
    @observable
    profile: Profile | null = null;

    @asyncAction
    * loadProfile() {
        const { data: { data } }: { data: { data: Profile } } = yield fetchProfile();
        this.profile = data;
    }
}