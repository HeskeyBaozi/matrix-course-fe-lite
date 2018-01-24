import { LoginModel } from '@/models/login.model';
import { ProfileModel } from '@/models/profile.model';
import { CoursesModel } from '@/models/courses.model';

export class Stores {
  $Login = new LoginModel();
  $Profile = new ProfileModel();
  $Courses = new CoursesModel();
}


export const stores = new Stores();
