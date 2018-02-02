import Info from '@/components/common/Info';
import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import ProgrammingReporter from '@/routes/OneAssignment/Programming/Report/reporter';
import { IProgrammingConfig } from '@/types/api';
import { AssignmentTimeStatus, ProgrammingKeys } from '@/types/constants';
import { statusFromGrade } from '@/utils/helpers';
import { Button, Card, Col, Modal, Row } from 'antd';
import { format } from 'date-fns/esm';
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
  get isLastSubmission() {
    const { $OneAssignment, $$Programming } = this.props;
    const { submissions } = $OneAssignment!;
    const { oneSubmission: { sub_ca_id } } = $$Programming!;
    return submissions.length ? submissions[ 0 ].sub_ca_id === sub_ca_id : false;
  }

  @computed
  get isShown() {
    return this.props.$OneAssignment!.submissions.length;
  }

  @computed
  get full() {
    return this.config.standard_score;
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
  get one() {
    const { $$Programming } = this.props;
    return $$Programming!.oneSubmission;
  }

  @computed
  get answerFiles() {
    const { $$Programming } = this.props;
    return $$Programming!.answerFiles;
  }

  @computed
  get formatTime() {
    const { $$Programming } = this.props;
    return format($$Programming!.submitAt, 'YYYY-MM-DD HH:mmA');
  }

  @computed
  get checkResponsiveProps() {
    return { xl: 12, lg: 24, md: 24, sm: 24, xs: 24, style: { marginBottom: '1rem' } };
  }

  @computed
  get submitIdText() {
    return this.isLastSubmission ? `${this.one.sub_ca_id} / 最近提交` : this.one.sub_ca_id;
  }

  @computed
  get currentScoreValue() {
    return statusFromGrade(this.one.grade, [
      'Waiting for judging', 'Under judging', `${this.one.grade}pts`
    ]);
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
      <div>
        <Button
          icon={ 'edit' }
          disabled={ $OneAssignment!.timeStatus !== AssignmentTimeStatus.InProgressing }
          onClick={ this.handleClickEdit }
        >编辑代码
        </Button>
      </div>
    );
  }

  render() {
    return this.isShown ? [ (
      <Card key={ 'meta' } style={ { marginBottom: '1rem' } }>
        <Row>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '提交ID' } value={ this.submitIdText } bordered={ true }/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '提交时间' } value={ this.formatTime } bordered={ true }/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '当前成绩' } value={ this.currentScoreValue }/>
          </Col>
        </Row>
        <ScoreBar
          hiddenText={ true }
          isSubmitted={ true }
          full={ this.full }
          strokeWidth={ 8 }
          grade={ this.one.grade }
        />
      </Card>
    ), (
      <Card key={ 'check' } loading={ this.loading || this.report === null } style={ { marginBottom: '1rem' } }>
        <ProgrammingReporter config={ this.config } report={ this.report || {} }/>
      </Card>
    ), (
      <Card key={ 'submitted-code' }>
        <MutableCodeEditor
          mutableDataSource={ this.answerFiles }
          extraDataSource={ null }
          extra={ this.Extra }
        />
      </Card>
    ) ] : (
      <Card>暂时没有任何记录</Card>
    );
  }
}
