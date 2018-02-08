import Markdown from '@/components/common/Markdown';
import MarkdownEditor from '@/components/common/MarkdownEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneSubmissionModel } from '@/models/one-submission.model';
import Feedback from '@/routes/OneAssignment/Common/FeedBack';
import Submissions from '@/routes/OneAssignment/Common/Submissions';
import { IAssignment, IConfigSubmission } from '@/types/api';
import { AssignmentTimeStatus, ProgramOutputKeys } from '@/types/constants';
import { IProgramOutputConfig } from '@/types/OneAssignment/program-output';
import { Button, Card, notification, Tabs } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

interface IProgramOutputProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgramOutput extends React.Component<IProgramOutputProps> {

  $$ProgramOutput = new OneSubmissionModel<string, IConfigSubmission<IProgramOutputConfig, string>, {}>();

  @observable
  answer = '';

  @observable
  isSubmitting = false;

  @action
  startSubmitting = () => {
    this.isSubmitting = true;
  }

  @action
  finishSubmitting = () => {
    this.isSubmitting = false;
  }

  @computed
  get assignment() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.assignment as IAssignment<IProgramOutputConfig>;
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  async LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment } = this.props;
    await this.$$ProgramOutput.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    const { $OneAssignment } = this.props;
    $OneAssignment!.changeTab(ProgramOutputKeys.GradeFeedback);
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  async componentDidMount() {
    const { course_id, ca_id } = this.assignment;
    await Promise.all([
      this.$$ProgramOutput.LoadLastSubmission({ course_id, ca_id })
    ]);
  }

  async submitFlow() {
    const { $OneAssignment } = this.props;
    const { course_id, ca_id } = this.assignment;
    const { sub_asgn_id } = await this.$$ProgramOutput.SubmitAnswers({
      course_id,
      ca_id
    }, { answers: [ this.answer ] });

    await Promise.all([
      $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
      this.$$ProgramOutput.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
    ]);

    notification.success({
      message: '作业提交成功',
      description: `成功提交作业 ${this.assignment.title}`
    });

    $OneAssignment!.changeTab(ProgramOutputKeys.GradeFeedback);

    if (!this.assignment.grade_at_end) {
      const count = await this.$$ProgramOutput.untilLastFinishJudging({
        course_id,
        ca_id,
        sub_ca_id: sub_asgn_id
      }, 2500, Infinity);

      await Promise.all([
        $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
        this.$$ProgramOutput.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
      ]);
    }

  }

  handleSubmit = async () => {
    this.startSubmitting();
    try {
      await this.submitFlow();
    } catch (error) {
      // throw error;
    }
    this.finishSubmitting();
  }

  @action
  handleChange = (next: string) => {
    this.answer = next;
  }

  @computed
  get FeedBackDetail() {
    return (
      <Card loading={ !this.$$ProgramOutput.isOneSubmissionLoaded }>
        <Markdown source={ this.$$ProgramOutput.oneSubmission.report || '暂无评语' }/>
      </Card>
    );
  }

  render() {
    const { $OneAssignment } = this.props;
    return (
      <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
        <TabPane key={ ProgramOutputKeys.Description } tab={ ProgramOutputKeys.Description }>
          <Card style={ { marginBottom: '1rem' } }>
            <Markdown source={ this.assignment.description || '这个出题人很懒...' }/>
          </Card>
          <Card>
            <MarkdownEditor value={ this.answer } onValueChange={ this.handleChange }/>
            <Button
              style={ { marginTop: '1rem' } }
              type={ 'primary' }
              icon={ 'check' }
              loading={ this.isSubmitting }
              disabled={ !this.answer.length || $OneAssignment!.timeStatus !== AssignmentTimeStatus.InProgressing }
              onClick={ this.handleSubmit }
            >提交
            </Button>
          </Card>
        </TabPane>
        <TabPane key={ ProgramOutputKeys.GradeFeedback } tab={ ProgramOutputKeys.GradeFeedback }>
          <Feedback submitAt={ this.$$ProgramOutput.submitAt } submission={ this.$$ProgramOutput.oneSubmission }>
            { this.FeedBackDetail }
          </Feedback>
        </TabPane>
        <TabPane key={ ProgramOutputKeys.Recordings } tab={ ProgramOutputKeys.Recordings }>
          <Submissions getClickHandler={ this.getClickHandler }/>
        </TabPane>
      </Tabs>
    );
  }
}
