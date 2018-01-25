import { fetchCoursesList } from '@/api/courses';
import { ICoursesItem } from '@/api/interface';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class CoursesModel {
  @observable
  courses: ICoursesItem[] = [];

  @observable
  isCoursesLoaded = false;

  @computed
  get openList() {
    return this.courses.filter((item) => item.status === 'open');
  }

  @computed
  get openCount() {
    return this.openList.length;
  }

  @computed
  get closeList() {
    return this.courses.filter((item) => item.status === 'close');
  }

  @asyncAction
  * LoadCoursesList() {
    const { data: { data: courses } } = yield fetchCoursesList();
    this.courses = courses;
    this.isCoursesLoaded = true;
  }
}
