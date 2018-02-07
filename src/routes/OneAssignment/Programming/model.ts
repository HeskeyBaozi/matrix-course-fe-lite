import {
  FetchAssignmentRank, FetchStandardAnswer, IOneAssignmentArgs
} from '@/api/one-assignment';
import { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { OneSubmissionModel } from '@/models/one-submission.model';
import { IAnswersSubmission, IProgrammingReport, IProgrammingSubmitDetail, IRanksItem } from '@/types/api';
import { action, computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

export class ProgrammingModel extends OneSubmissionModel  <IProgrammingReport,
  IAnswersSubmission<{ code: string, name: string }, IProgrammingReport>, IProgrammingSubmitDetail> {

  @observable
  ranks: IRanksItem[] = [];

  @observable
  isRanksLoaded = false;

  @observable
  currentAnswers: Array<{ code: string, name: string }> = [];

  @observable
  standardAnswer: Array<{ name: string, code: string }> = [];

  @observable
  isStandardAnswerLoaded = false;

  @computed
  get answerFiles(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = new Map();
    return (this.oneSubmission.answers || [])
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
  * LoadStandardAnswer(args: IOneAssignmentArgs) {
    this.isStandardAnswerLoaded = false;
    const { data: { data: standardAnswer } } = yield FetchStandardAnswer<Array<{ name: string, code: string }>>(args);
    this.standardAnswer = standardAnswer;
    this.isStandardAnswerLoaded = true;
  }
}
