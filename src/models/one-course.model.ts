import { fetchAssignments, fetchCourseDetail, fetchDiscussions } from '@/services/one-course';
import { fetchAvatar } from '@/services/user';
import { IAssignmentItem, IDiscussionItem, IOneCourse } from '@/types/api';
import { isAfter, isBefore, isWithinInterval } from 'date-fns/esm';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

const voidOne: IOneCourse = {
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
  description: '',
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

export class OneCourseModel {
  @observable
  one: IOneCourse = voidOne;

  @observable
  creatorAvatarUrl = '';

  @observable
  isOneCourseLoaded = false;

  @observable
  assignments: IAssignmentItem[] = [];

  @computed
  get notStarted() {
    return this.assignments.filter(({ startdate }) => isAfter(startdate, Date.now()));
  }

  @computed
  get inProgress() {
    return this.assignments
      .filter(({ startdate, enddate }) => isWithinInterval(Date.now(), { start: startdate, end: enddate }));
  }

  @computed
  get outOfDate() {
    return this.assignments.filter(({ enddate }) => isBefore(enddate, Date.now()));
  }

  @observable
  isAssignmentsLoaded = false;

  @observable
  discussions: IDiscussionItem[] = [];

  @observable
  isDiscussionsLoaded = false;

  @computed
  get courseId() {
    return this.one.course_id;
  }

  async LoadOneCourse(courseId: number) {
    return Promise.all([
      this.LoadDetail(courseId),
      this.LoadAssignments(courseId),
      this.LoadDiscussions(courseId)
    ]);
  }

  @asyncAction
  * LoadDetail(courseId: number) {
    this.isOneCourseLoaded = false;
    const { data: { data: course } } = yield fetchCourseDetail({ courseId });
    this.one = course && course.creator && course.creator.realname && course || voidOne;
    this.isOneCourseLoaded = true;
    yield this.LoadAvatar();
  }

  @asyncAction
  * LoadAvatar() {
    if (this.creatorAvatarUrl) {
      this.releaseCreatorAvatarUrl();
    }
    const { username } = this.one.creator;
    const { data }: { data: Blob } = yield fetchAvatar(username);
    this.creatorAvatarUrl = URL.createObjectURL(data);
  }

  @asyncAction
  * LoadAssignments(courseId: number) {
    this.isAssignmentsLoaded = false;
    const { data: { data: assignments } } = yield fetchAssignments({ courseId });
    this.assignments = Array.isArray(assignments) && assignments || [];
    this.isAssignmentsLoaded = true;
  }

  @asyncAction
  * LoadDiscussions(courseId: number) {
    this.isDiscussionsLoaded = false;
    const { data: { data: discussions } } = yield fetchDiscussions({ courseId });
    this.discussions = Array.isArray(discussions) && discussions || [];
    this.isDiscussionsLoaded = true;
  }

  releaseCreatorAvatarUrl() {
    URL.revokeObjectURL(this.creatorAvatarUrl);
  }
}
