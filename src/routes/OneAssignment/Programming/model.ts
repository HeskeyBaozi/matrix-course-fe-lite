import {
  FetchLastSubmission, FetchOneSubmission, IOneAssignmentArgs,
  IOneAssignmentOneSubmissionArgs
} from '@/api/one-assignment';
import { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { IProgrammingSubmission } from '@/types/api';
import { computed, observable } from 'mobx';
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

  @computed
  get answerFiles(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = new Map();
    return this.oneSubmission!.answers
      .reduce((acc, file) => {
        acc.set(file.name, {
          readOnly: true,
          value: file.code
        });
        return acc;
      }, start);
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
}
