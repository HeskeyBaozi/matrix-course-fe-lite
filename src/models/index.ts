import { LoginModel } from '@/models/login.model';
import { ProfileModel } from '@/models/profile.model';
import { CoursesModel } from '@/models/courses.model';
import { OneCourseModel } from '@/models/one-course.model';

export class Stores {
  $Login = new LoginModel();
  $Profile = new ProfileModel();
  $Courses = new CoursesModel();
  $OneCourse = new OneCourseModel();
}


export const stores = new Stores();
