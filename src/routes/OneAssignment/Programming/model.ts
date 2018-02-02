import {
  FetchAssignmentRank,
  FetchLastSubmission, FetchOneSubmission, IOneAssignmentArgs,
  IOneAssignmentOneSubmissionArgs, PostOneSubmissions
} from '@/api/one-assignment';
import { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { IProgrammingSubmission, IProgrammingSubmitDetail, IRanksItem } from '@/types/api';
import { action, computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class ProgrammingModel {
  @observable
  oneSubmission: IProgrammingSubmission = {
    answers: [],
    grade: null,
    report: {},
    sub_ca_id: 0
  };

  @observable
  submitAt: string = '';

  @observable
  isOneSubmissionLoaded = false;

  @observable
  ranks: IRanksItem[] = [];

  @observable
  isRanksLoaded = false;

  @observable
  currentAnswers: Array<{ code: string, name: string }> = [];

  @computed
  get answerFiles(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = new Map();
    return this.oneSubmission.answers
      .reduce((acc, file) => {
        acc.set(file.name, {
          readOnly: true,
          value: file.code
        });
        return acc;
      }, start);
  }

  @action
  LoadCurrentSubmissionAnswers() {
    this.currentAnswers = this.oneSubmission.answers;
  }

  @asyncAction
  * LoadOneSubmission({ course_id, ca_id, sub_ca_id }: IOneAssignmentOneSubmissionArgs) {
    this.isOneSubmissionLoaded = false;
    try {
      const {
        data: { data: one, paramData: { submission: { submit_at } } }
      } = yield FetchOneSubmission<IProgrammingSubmission>({
        course_id, ca_id, sub_ca_id
      });
      this.oneSubmission = one;
      this.submitAt = submit_at;
    } catch (error) {
      throw error;
    }
    this.isOneSubmissionLoaded = true;
  }

  @asyncAction
  * LoadLastSubmission({ course_id, ca_id }: IOneAssignmentArgs) {
    this.isOneSubmissionLoaded = false;
    try {
      const {
        data: { data: one, paramData: { submission: { submit_at } } }
      } = yield FetchLastSubmission<IProgrammingSubmission>({
        course_id, ca_id
      });
      this.oneSubmission = one;
      this.submitAt = submit_at;
    } catch (error) {
      throw error;
    }
    this.isOneSubmissionLoaded = true;
  }

  @asyncAction
  * LoadRanks({ course_id, ca_id }: IOneAssignmentArgs) {
    this.isRanksLoaded = false;
    const {
      data: { data: ranks }
    } = yield FetchAssignmentRank({
      course_id, ca_id
    });
    this.ranks = Array.isArray(ranks) ? ranks : [];
    this.isRanksLoaded = true;
  }

  @asyncAction
  * SubmitAnswers({ course_id, ca_id }: IOneAssignmentArgs, detail: IProgrammingSubmitDetail) {
    const { data: { data: result } } = yield PostOneSubmissions<IProgrammingSubmitDetail>({ course_id, ca_id }, detail);
    return result as { sub_asgn_id: number };
  }

  async untilLastFinishJudging(args: IOneAssignmentOneSubmissionArgs,
                               time: number, limit: number = 5): Promise<number> {
    return new Promise<number>(async (resolve, reject) => {
      let finished = false;
      let count: number = 0;
      while (!finished && count < limit) {
        try {
          const { data: { data: one } } = await FetchOneSubmission(args);
          const submission = one as IProgrammingSubmission;
          if (submission && submission.grade !== null && submission.grade !== -1) {
            finished = true;
            resolve(count);
          }
        } catch (error) {
          count--;
        }
        if (!finished) {
          await new Promise((resolve2) => {
            setTimeout(() => {
              resolve2();
            }, time);
          });
          count++;
        }
      }
      resolve(count);
    });
  }
}
