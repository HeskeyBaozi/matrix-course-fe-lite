import { IAssignment, ISubmission } from '@/api/interface';
import { FetchAssignmentDetail, FetchLastSubmission, IOneAssignmentArgs } from '@/api/one-assignment';
import { AssignmentTimeStatus } from '@/constants';
import { isAfter, isBefore, isWithinInterval } from 'date-fns/esm';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

const voidAssignment: IAssignment = {
  asgn_id: 0,
  author: {
    realname: '',
    email: ''
  },
  ca_id: 0,
  course_id: 0,
  config: {},
  description: '',
  enddate: new Date().toString(),
  grade_at_end: 0,
  plcheck: 0,
  ptype_id: -1,
  pub_answer: 0,
  standard_score: 0,
  startdate: new Date().toString(),
  submit_limitation: 0,
  title: '',
  type: '',
  updated_at: new Date().toString()
};

const voidLast: ISubmission = {
  config: {},
  grade: null,
  report: {},
  sub_ca_id: 0
};

export class OneAssignmentModel {
  @observable
  assignment = voidAssignment;

  @observable
  isDetailLoaded = false;

  @observable
  last = voidLast;

  @observable
  hasLastSubmission = false;

  @observable
  isLastSubmitLoaded = false;

  @computed
  get isBaseInformationLoaded() {
    return this.isDetailLoaded && this.isLastSubmitLoaded;
  }

  @computed
  get timeStatus(): AssignmentTimeStatus {
    const { startdate, enddate } = this.assignment;
    if (isAfter(startdate, Date.now())) {
      return AssignmentTimeStatus.NotStarted;
    }
    if (isWithinInterval(Date.now(), { start: startdate, end: enddate })) {
      return AssignmentTimeStatus.InProgressing;
    }
    if (isBefore(enddate, Date.now())) {
      return AssignmentTimeStatus.OutOfDate;
    }
    throw Error('timeStatus should be valid. ' + 'startdate' + startdate + 'enddate' + enddate);
  }

  async LoadOneAssignment(args: IOneAssignmentArgs) {
    return Promise.all([
      this.LoadDetail(args),
      this.LoadLast(args)
    ]);
  }

  @asyncAction
  * LoadDetail(args: IOneAssignmentArgs) {
    this.isDetailLoaded = false;
    try {
      const { data: { data: assignment } } = yield FetchAssignmentDetail(args);
      this.assignment = assignment;
    } catch (error) {
      this.assignment = voidAssignment;
    }
    this.isDetailLoaded = true;
  }

  @asyncAction
  * LoadLast(args: IOneAssignmentArgs) {
    this.isLastSubmitLoaded = false;
    this.hasLastSubmission = false;
    try {
      const { data: { data: last } } = yield FetchLastSubmission(args);
      this.last = last;
      this.hasLastSubmission = true;
    } catch (error) {
      this.last = voidLast;
      this.hasLastSubmission = false;
    }
    this.isLastSubmitLoaded = true;
  }
}
