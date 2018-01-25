import { IOneCourse } from '@/api/interface';
import { fetchCourseDetail, fetchCoursePersonalGrades, fetchCoursePersonalRank } from '@/api/one-course';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class OneCourseModel {
  @observable
  one: IOneCourse = {
    course_id: 0,
    course_name: '',
    created_at: Date.now().toString(),
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
    type: '',
    unfinished_num: 0
  };

  @observable
  isOneCourseLoaded = false;

  @computed
  get courseId() {
    return this.one.course_id;
  }

  @asyncAction
  * LoadOneCourse(courseId: number) {
    this.isOneCourseLoaded = false;
    const { data: { data: course } } = yield fetchCourseDetail({ courseId });
    this.one = course;

    this.isOneCourseLoaded = true;
  }
}
