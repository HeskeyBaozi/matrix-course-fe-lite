import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchCourseDetail } from '@/api/one-course';
import { OneCourse } from '@/api/interface';

export class OneCourseModel {
  @observable
  one: OneCourse = {
    created_at: Date.now().toString(),
    type: '',
    course_id: 0,
    course_name: '',
    creator: {
      email: null,
      homepage: null,
      phone: null,
      realname: '',
      username: ''
    },
    progressing_num: 0,
    role: '',
    school_year: '',
    semester: '',
    status: 'close',
    student_num: 0,
    teacher: '',
    term: '',
    unfinished_num: 0,
  };

  @observable
  isOneCourseLoaded = false;

  @asyncAction
  * LoadOneCourse(courseId: number) {
    this.isOneCourseLoaded = false;
    const { data: { data: course } } = yield fetchCourseDetail({ courseId });
    this.one = course;
    this.isOneCourseLoaded = true;
  }
}
