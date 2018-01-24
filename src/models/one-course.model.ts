import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchCourseDetail, fetchCoursePersonalGrades, fetchCoursePersonalRank } from '@/api/one-course';
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

  @computed
  get courseId() {
    return this.one.course_id;
  }

  @observable
  myRank = {};

  @observable
  myGrades = {};

  @asyncAction
  * LoadOneCourse(courseId: number) {
    this.isOneCourseLoaded = false;
    const { data: { data: course } } = yield fetchCourseDetail({ courseId });
    this.one = course;
    const [
      { data: { data: myRank } },
      { data: { data: myGrades } }
    ] = yield Promise.all([
      fetchCoursePersonalRank({ courseId: this.courseId }),
      fetchCoursePersonalGrades({ courseId: this.courseId })
    ]);
    this.myRank = myRank;
    this.myGrades = myGrades;

    console.log('rank', myRank);
    console.log('grade', myGrades);
    this.isOneCourseLoaded = true;
  }
}
