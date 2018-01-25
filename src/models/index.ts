import { CoursesModel } from '@/models/courses.model';
import { LoginModel } from '@/models/login.model';
import { OneCourseModel } from '@/models/one-course.model';
import { ProfileModel } from '@/models/profile.model';

export class Stores {
  $Login = new LoginModel();
  $Profile = new ProfileModel();
  $Courses = new CoursesModel();
  $OneCourse = new OneCourseModel();
}

export const stores = new Stores();
