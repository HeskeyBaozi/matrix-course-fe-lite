import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneSubmissionModel } from '@/models/one-submission.model';
import Feedback from '@/pages/OneAssignment/Common/FeedBack';
import Submissions from '@/pages/OneAssignment/Common/Submissions';
import { IAssignment, IShortAnswerSubmission } from '@/types/api';
import { ShortAnswerKeys } from '@/types/constants';
import { IShortAnswerConfig } from '@/types/OneAssignment/short-answer';
import { Card, Tabs } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import ShortAnswerForm from './Form';

const { TabPane } = Tabs;

interface IShortAnswerProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ShortAnswer extends React.Component<IShortAnswerProps> {

  $$ShortAnswer = new OneSubmissionModel<string,
    IShortAnswerSubmission<string, IShortAnswerConfig, string>, { answers: string[] }>();

  @computed
  get assignment() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.assignment as IAssignment<IShortAnswerConfig>;
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  async LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment } = this.props;
    await this.$$ShortAnswer.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    const { $OneAssignment } = this.props;
    $OneAssignment!.changeTab(ShortAnswerKeys.GradeFeedback);
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  async componentDidMount() {
    const { course_id, ca_id } = this.assignment;
    await Promise.all([
      this.$$ShortAnswer.LoadLastSubmission({ course_id, ca_id })
    ]);
  }

  async submitFlow(answers: string[]) {
    const { $OneAssignment } = this.props;
    const { course_id, ca_id } = this.assignment;
    const { sub_asgn_id } = await this.$$ShortAnswer.SubmitAnswers({ course_id, ca_id }, { answers });

    await Promise.all([
      $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
      this.$$ShortAnswer.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
    ]);

    $OneAssignment!.changeTab(ShortAnswerKeys.GradeFeedback);

    if (!this.assignment.grade_at_end) {
      const count = await this.$$ShortAnswer.untilLastFinishJudging({
        course_id,
        ca_id,
        sub_ca_id: sub_asgn_id
      }, 2500, Infinity);

      await Promise.all([
        $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
        this.$$ShortAnswer.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
      ]);
    }
  }

  handleSubmit = async (answers: string[]) => {
    try {
      await this.submitFlow(answers);
    } catch (error) {
      // none
    }
  }

  @computed
  get FeedBackDetail() {

    const result = [ (
      <Card
        loading={ !this.$$ShortAnswer.isOneSubmissionLoaded }
        key={ 'feedback' }
        style={ { marginBottom: '1rem' } }
      >
        <Markdown source={ this.$$ShortAnswer.oneSubmission.report || '暂无评语' }/>
      </Card>
    ) ];

    if (this.assignment.pub_answer) {
      result.push((
        <Card
          loading={ !this.$$ShortAnswer.isOneSubmissionLoaded }
          key={ 'my-submit' }
        >
          <ShortAnswerForm
            config={ this.assignment.config }
            answers={ this.$$ShortAnswer.oneSubmission.answers }
          />
        </Card>
      ));
    }
    return result;
  }

  render() {
    return (
      <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
        <TabPane key={ ShortAnswerKeys.Description } tab={ ShortAnswerKeys.Description }>
          <Card style={ { marginBottom: '1rem' } }>
            <Markdown source={ this.assignment.description || '这个出题人很懒...' }/>
          </Card>
          <Card>
            <ShortAnswerForm config={ this.assignment.config } onSubmit={ this.handleSubmit }/>
          </Card>
        </TabPane>
        <TabPane key={ ShortAnswerKeys.GradeFeedback } tab={ ShortAnswerKeys.GradeFeedback }>
          <Feedback submitAt={ this.$$ShortAnswer.submitAt } submission={ this.$$ShortAnswer.oneSubmission }>
            { this.FeedBackDetail }
          </Feedback>
        </TabPane>
        <TabPane key={ ShortAnswerKeys.Recordings } tab={ ShortAnswerKeys.Recordings }>
          <Submissions getClickHandler={ this.getClickHandler }/>
        </TabPane>
      </Tabs>
    );
  }
}
