import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneSubmissionModel } from '@/models/one-submission.model';
import Feedback from '@/routes/OneAssignment/Common/FeedBack';
import Submissions from '@/routes/OneAssignment/Common/Submissions';
import { IAssignment } from '@/types/api';
import { AssignmentTimeStatus, ChoiceKeys } from '@/types/constants';
import {
  IChoiceAnswerItem, IChoiceConfig, IChoiceFormResultItem, IChoiceReport,
  IChoiceSubmitDetail
} from '@/types/OneAssignment/choice';
import { Card, Tabs } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import ChoiceForm from './Form';

const { TabPane } = Tabs;

interface IChoiceProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class Choice extends React.Component<IChoiceProps> {

  $$ChoiceSubmission = new OneSubmissionModel<IChoiceAnswerItem, IChoiceReport, IChoiceSubmitDetail>();

  @computed
  get assignment() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.assignment as IAssignment<IChoiceConfig>;
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  async LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment } = this.props;
    await this.$$ChoiceSubmission.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    const { $OneAssignment } = this.props;
    $OneAssignment!.changeTab(ChoiceKeys.GradeFeedback);
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  async componentDidMount() {
    const { course_id, ca_id } = this.assignment;
    await Promise.all([
      this.$$ChoiceSubmission.LoadLastSubmission({ course_id, ca_id })
    ]);
  }

  handleSubmit = async (result: IChoiceFormResultItem[]) => {
    const { $OneAssignment } = this.props;
    const { course_id, ca_id } = this.assignment;
    try {
      const { sub_asgn_id } = await this.$$ChoiceSubmission.SubmitAnswers({ course_id, ca_id }, { answers: result });

      await Promise.all([
        $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
        this.$$ChoiceSubmission.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
      ]);

      $OneAssignment!.changeTab(ChoiceKeys.GradeFeedback);

      if (!this.assignment.grade_at_end) {
        const count = await this.$$ChoiceSubmission.untilLastFinishJudging({
          course_id,
          ca_id,
          sub_ca_id: sub_asgn_id
        }, 2500, Infinity);

        await Promise.all([
          $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
          this.$$ChoiceSubmission.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
        ]);
      }
    } catch (error) {
      // throw error;
    }
  }

  @computed
  get FeedBackDetail() {
    return this.assignment.pub_answer ? (
      <Card>
        <ChoiceForm
          config={ this.assignment.config }
          report={ this.$$ChoiceSubmission.oneSubmission.report }
        />
      </Card>
    ) : null;
  }

  render() {
    return (
      <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
        <TabPane key={ ChoiceKeys.Description } tab={ ChoiceKeys.Description }>
          <Card style={ { marginBottom: '1rem' } }>
            <Markdown source={ this.assignment.description || '这个出题人很懒...' }/>
          </Card>
          <Card>
            <ChoiceForm config={ this.assignment.config } onSubmit={ this.handleSubmit }/>
          </Card>
        </TabPane>
        <TabPane key={ ChoiceKeys.GradeFeedback } tab={ ChoiceKeys.GradeFeedback }>
          <Feedback submitAt={ this.$$ChoiceSubmission.submitAt } submission={ this.$$ChoiceSubmission.oneSubmission }>
            { this.FeedBackDetail }
          </Feedback>
        </TabPane>
        <TabPane key={ ChoiceKeys.Recordings } tab={ ChoiceKeys.Recordings }>
          <Submissions getClickHandler={ this.getClickHandler }/>
        </TabPane>
      </Tabs>
    );
  }
}
