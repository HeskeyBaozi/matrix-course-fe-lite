import Info from '@/components/common/Info';
import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import ProgrammingReporter from '@/routes/OneAssignment/Programming/Report/reporter';
import { IProgrammingConfig } from '@/types/api';
import { statusFromGrade } from '@/utils/helpers';
import { Button, Card, Col, Row } from 'antd';
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
    return format($$Programming!.submitAt, 'YYYY-MM-DD HH:mm:SS');
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

  @computed
  get Extra() {
    return (
      <div>
        <Button icon={ 'edit' }>编辑代码</Button>
      </div>
    );
  }

  render() {
    return this.isShown ? [ (
      <Card key={ 'meta' } style={ { marginBottom: '1rem' } } loading={ this.loading }>
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
      <Card key={ 'check' } loading={ this.loading } style={ { marginBottom: '1rem' } }>
        <ProgrammingReporter config={ this.config } report={ this.report }/>
      </Card>
    ), (
      <Card key={ 'submitted-code' } loading={ this.loading }>
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
