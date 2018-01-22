import { LoginModel } from '@/models/login.model';
import { ProfileModel } from '@/models/profile.model';

export class Stores {
  $Login = new LoginModel();
  $Profile = new ProfileModel();
}


export const stores = new Stores();
