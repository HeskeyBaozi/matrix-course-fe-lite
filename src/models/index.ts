import { CoursesModel } from '@/models/courses.model';
import { LoginModel } from '@/models/login.model';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneCourseModel } from '@/models/one-course.model';
import { ProfileModel } from '@/models/profile.model';

export class Stores {
  $Login = new LoginModel();
  $Profile = new ProfileModel();
  $Courses = new CoursesModel();
  $OneCourse = new OneCourseModel();
  $OneAssignment = new OneAssignmentModel();
}

export const stores = new Stores();
