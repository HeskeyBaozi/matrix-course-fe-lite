import {
  FetchAssignmentDetail, FetchSubmissionsList,
  IOneAssignmentArgs
} from '@/services/one-assignment';
import { IAssignment, ISubmissionItem } from '@/types/api';
import { ItabItem } from '@/types/common';
import {
  AssignmentTimeStatus, ChoiceKeys, FileUploadKeys, GeneralKey, ProgrammingKeys, ProgramOutputKeys,
  PType, ReportKeys, ShortAnswerKeys
} from '@/types/constants';
import { isAfter, isBefore, isWithinInterval } from 'date-fns/esm';
import { action, computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

const voidAssignment: IAssignment<any> = {
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

export class OneAssignmentModel {
  @observable
  assignment = voidAssignment;

  @observable
  submissions: ISubmissionItem[] = [];

  @observable
  isSubmissionsLoaded = false;

  @observable
  isDetailLoaded = false;

  @observable
  tabActiveKey: GeneralKey = ProgrammingKeys.Description;

  @action
  changeTab(next: GeneralKey) {
    this.tabActiveKey = next;
  }

  @action
  needReload() {
    this.isDetailLoaded = false;
  }

  @computed
  get tabList(): Array<ItabItem<GeneralKey>> {
    switch (this.assignment.ptype_id) {
      case PType.Programming:
        const list = [
          { tab: '题目描述', key: ProgrammingKeys.Description, icon: 'file-text' },
          { tab: '当前提交', key: ProgrammingKeys.Submit, icon: 'upload' },
          { tab: '成绩反馈', key: ProgrammingKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: ProgrammingKeys.Recordings, icon: 'calendar' },
          { tab: '排名分布', key: ProgrammingKeys.Rank, icon: 'bar-chart' }
        ];
        if (this.assignment.pub_answer) {
          list.push({ tab: '标准答案', key: ProgrammingKeys.StandardAnswer, icon: 'eye-o' });
        }
        return list;
      case PType.Choice:
        return [
          { tab: '题目描述', key: ChoiceKeys.Description, icon: 'file-text' },
          { tab: '成绩反馈', key: ChoiceKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: ChoiceKeys.Recordings, icon: 'calendar' }
        ];
      case PType.FileUpload:
        return [
          { tab: '题目描述', key: FileUploadKeys.Description, icon: 'file-text' },
          { tab: '成绩反馈', key: FileUploadKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: FileUploadKeys.Recordings, icon: 'calendar' }
        ];
      case PType.ProgramBlankFilling:
        return [];
      case PType.ProgramOutput:
        return [
          { tab: '题目描述', key: ProgramOutputKeys.Description, icon: 'file-text' },
          { tab: '成绩反馈', key: ProgramOutputKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: ProgramOutputKeys.Recordings, icon: 'calendar' }
        ];
      case PType.Report:
        return [
          { tab: '题目描述', key: ReportKeys.Description, icon: 'file-text' },
          { tab: '当前提交', key: ReportKeys.Submit, icon: 'upload' },
          { tab: '成绩反馈', key: ReportKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: ReportKeys.Recordings, icon: 'calendar' }
        ];
      case PType.ShortAnswer:
        return [
          { tab: '题目描述', key: ShortAnswerKeys.Description, icon: 'file-text' },
          { tab: '成绩反馈', key: ShortAnswerKeys.GradeFeedback, icon: 'check' },
          { tab: '历史记录', key: ShortAnswerKeys.Recordings, icon: 'calendar' }
        ];
      default:
        return [];
    }
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
      this.LoadSubmissions(args)
    ]);
  }

  @asyncAction
  * LoadDetail(args: IOneAssignmentArgs) {
    this.needReload();
    try {
      const { data: { data: assignment } } = yield FetchAssignmentDetail(args);
      this.assignment = assignment as IAssignment<any>;
    } catch (error) {
      this.assignment = voidAssignment;
    }
    this.isDetailLoaded = true;
  }

  @asyncAction
  * LoadSubmissions(args: IOneAssignmentArgs) {
    this.isSubmissionsLoaded = false;
    try {
      const { data: { data: submissions } } = yield FetchSubmissionsList(args);
      this.submissions = submissions;
    } catch (error) {
      this.submissions = [];
    }
    this.isSubmissionsLoaded = true;
  }

  @action
  resetTab() {
    this.changeTab(ProgrammingKeys.Description);
  }
}
