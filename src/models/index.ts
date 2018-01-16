import { LoginModel } from '@/models/login.model';

export class Stores {
  $Login = new LoginModel()
}


export const stores = new Stores();
