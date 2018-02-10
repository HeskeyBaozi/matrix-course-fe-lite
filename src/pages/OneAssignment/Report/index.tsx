import Markdown from '@/components/common/Markdown';
import MarkdownEditor from '@/components/common/MarkdownEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { OneSubmissionModel } from '@/models/one-submission.model';
import Feedback from '@/pages/OneAssignment/Common/FeedBack';
import Submissions from '@/pages/OneAssignment/Common/Submissions';
import { IAssignment, IReportSubmission } from '@/types/api';
import {
  AssignmentTimeStatus,
  ReportKeys
} from '@/types/constants';
import { IReportConfig } from '@/types/OneAssignment/report';
import { Button, Card, Modal, notification, Tabs } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

interface IReportProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class Report extends React.Component<IReportProps> {

  $$Report = new OneSubmissionModel<string, IReportSubmission<string>, {}>();

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
    return $OneAssignment!.assignment as IAssignment<IReportConfig>;
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  async LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment } = this.props;
    await this.$$Report.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    const { $OneAssignment } = this.props;
    $OneAssignment!.changeTab(ReportKeys.GradeFeedback);
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  async componentDidMount() {
    const { course_id, ca_id } = this.assignment;
    await Promise.all([
      this.$$Report.LoadLastSubmission({ course_id, ca_id })
    ]);
  }

  async submitFlow() {
    const { $OneAssignment } = this.props;
    const { course_id, ca_id } = this.assignment;
    const { sub_asgn_id } = await this.$$Report.SubmitAnswers({
      course_id,
      ca_id
    }, { answers: this.answer });

    await Promise.all([
      $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
      this.$$Report.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
    ]);

    notification.success({
      message: '作业提交成功',
      description: `成功提交作业 ${this.assignment.title}`
    });

    $OneAssignment!.changeTab(ReportKeys.GradeFeedback);

    if (!this.assignment.grade_at_end) {
      const count = await this.$$Report.untilLastFinishJudging({
        course_id,
        ca_id,
        sub_ca_id: sub_asgn_id
      }, 2500, Infinity);

      await Promise.all([
        $OneAssignment!.LoadSubmissions({ course_id, ca_id }),
        this.$$Report.LoadOneSubmission({ course_id, ca_id, sub_ca_id: sub_asgn_id })
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

  handleClickEdit = () => {
    const { $OneAssignment } = this.props;
    const content = [
      <div key={ 'pt1' }>你将会<strong style={ { fontSize: '1rem' } }>丢失</strong>当前提交编辑框中的内容,</div>,
      <div key={ 'pt2' }>推荐先将其保存到本地作为备份.</div>
    ];
    const ref = Modal.confirm({
      title: '确定编辑此提交的内容吗?',
      content,
      zIndex: 10000,
      iconType: 'warning',
      maskClosable: true,
      onOk: action(() => {
        ref.destroy();
        this.answer = this.$$Report.oneSubmission.answers;
        $OneAssignment!.changeTab(ReportKeys.Submit);
      }),
      onCancel: () => {
        ref.destroy();
      }
    });
  }

  @action
  handleChange = (next: string) => {
    this.answer = next;
  }

  @computed
  get Extra() {
    const { $OneAssignment } = this.props;
    return (
      <Button
        icon={ 'edit' }
        disabled={ $OneAssignment!.timeStatus !== AssignmentTimeStatus.InProgressing }
        onClick={ this.handleClickEdit }
      >编辑此次提交
      </Button>
    );
  }

  @computed
  get FeedBackDetail() {
    return [ (
      <Card
        loading={ !this.$$Report.isOneSubmissionLoaded }
        key={ 'feedback' }
        style={ { marginBottom: '1rem' } }
      >
        <Markdown source={ this.$$Report.oneSubmission.report || '暂无评语' }/>
      </Card>
    ), (
      <Card
        loading={ !this.$$Report.isOneSubmissionLoaded }
        key={ 'my-submit' }
        title={ '我的提交' }
        extra={ this.Extra }
      >
        <Markdown source={ this.$$Report.oneSubmission.answers || '暂时无法读取提交的报告' }/>
      </Card>
    ) ];
  }

  render() {
    const { $OneAssignment } = this.props;
    return (
      <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
        <TabPane key={ ReportKeys.Description } tab={ ReportKeys.Description }>
          <Card style={ { marginBottom: '1rem' } }>
            <Markdown source={ this.assignment.description || '这个出题人很懒...' }/>
          </Card>
        </TabPane>
        <TabPane key={ ReportKeys.Submit } tab={ ReportKeys.Submit }>
          <Card>
            <MarkdownEditor value={ this.answer } onValueChange={ this.handleChange } minRows={ 12 }/>
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
        <TabPane key={ ReportKeys.GradeFeedback } tab={ ReportKeys.GradeFeedback }>
          <Feedback submitAt={ this.$$Report.submitAt } submission={ this.$$Report.oneSubmission }>
            { this.FeedBackDetail }
          </Feedback>
        </TabPane>
        <TabPane key={ ReportKeys.Recordings } tab={ ReportKeys.Recordings }>
          <Submissions getClickHandler={ this.getClickHandler }/>
        </TabPane>
      </Tabs>
    );
  }
}
