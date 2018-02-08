import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import Feedback from '@/routes/OneAssignment/Common/FeedBack';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import ProgrammingReporter from '@/routes/OneAssignment/Programming/Report/reporter';
import { IProgrammingConfig } from '@/types/api';
import { AssignmentTimeStatus, ProgrammingKeys } from '@/types/constants';
import { Button, Card, Modal } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingReportProps {
  $OneAssignment?: OneAssignmentModel;
  $$Programming?: ProgrammingModel;
}

@inject('$OneAssignment', '$$Programming')
@observer
export default class ProgrammingReport extends React.Component<IProgrammingReportProps> {
  @computed
  get loading() {
    return !this.props.$$Programming!.isOneSubmissionLoaded;
  }

  @computed
  get config() {
    return this.props.$OneAssignment!.assignment.config as IProgrammingConfig;
  }

  @computed
  get report() {
    const { $$Programming } = this.props;
    return $$Programming!.oneSubmission.report;
  }

  @computed
  get answerFiles() {
    const { $$Programming } = this.props;
    return $$Programming!.answerFiles;
  }

  handleClickEdit = () => {
    const { $$Programming, $OneAssignment } = this.props;
    const content = [
      <div key={ 'pt1' }>你将会<strong style={ { fontSize: '1rem' } }>丢失</strong>当前提交编辑框中的代码,</div>,
      <div key={ 'pt2' }>推荐先将其保存到本地作为备份.</div>
    ];
    const ref = Modal.confirm({
      title: '确定编辑此提交的代码吗?',
      content,
      zIndex: 10000,
      iconType: 'warning',
      maskClosable: true,
      onOk: () => {
        ref.destroy();
        $$Programming!.LoadCurrentSubmissionAnswers();
        $OneAssignment!.changeTab(ProgrammingKeys.Submit);
      },
      onCancel: () => {
        ref.destroy();
      }
    });
  }

  @computed
  get Extra() {
    const { $OneAssignment } = this.props;
    return (
      <Button
        icon={ 'edit' }
        disabled={ $OneAssignment!.timeStatus !== AssignmentTimeStatus.InProgressing }
        onClick={ this.handleClickEdit }
      >编辑代码
      </Button>
    );
  }

  @computed
  get Reporter() {
    const { $OneAssignment } = this.props;
    return !$OneAssignment!.assignment.grade_at_end ? (
      <Card key={ 'check' } loading={ this.loading || this.report === null } style={ { marginBottom: '1rem' } }>
        <ProgrammingReporter config={ this.config } report={ this.report || {} }/>
      </Card>
    ) : null;
  }

  render() {
    const { $$Programming } = this.props;
    return (
      <Feedback submission={ $$Programming!.oneSubmission } submitAt={ $$Programming!.submitAt }>
        { this.Reporter }
        <Card key={ 'submitted-code' }>
          <MutableCodeEditor
            mutableDataSource={ this.answerFiles }
            extraDataSource={ null }
            extra={ this.Extra }
          />
        </Card>
      </Feedback>
    );
  }
}
