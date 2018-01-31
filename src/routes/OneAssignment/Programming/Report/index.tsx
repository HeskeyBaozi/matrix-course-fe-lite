import Info from '@/components/common/Info';
import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
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
  get Extra() {
    return (
      <div>
        <Button icon={ 'edit' }>编辑代码</Button>
      </div>
    );
  }

  @computed
  get CompileCheck() {
    return this.report[ 'compile check' ] && this.config.grading[ 'compile check' ] ? (
      <Col { ...this.checkResponsiveProps }>
        <Card key={ 'compile-check' } title={ 'Compile Check' } loading={ this.loading }>
          123
        </Card>
      </Col>
    ) : null;
  }

  render() {
    return [ (
      <Card key={ 'meta' } style={ { marginBottom: '1rem' } } loading={ this.loading }>
        <Row>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '提交ID' } value={ this.one.sub_ca_id } bordered={ true }/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info title={ '提交时间' } value={ this.formatTime } bordered={ true }/>
          </Col>
          <Col sm={ 8 } xs={ 24 }>
            <Info
              title={ '当前成绩' }
              value={ statusFromGrade(this.one.grade, [ 'Waiting for judging', 'Under judging', this.one.grade ]) }
            />
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
      <Row key={ 'check' }>
        { this.CompileCheck }
      </Row>
    ), (
      <Card key={ 'submitted-code' } loading={ this.loading }>
        <MutableCodeEditor
          mutableDataSource={ this.answerFiles }
          extraDataSource={ null }
          extra={ this.Extra }
        />
      </Card>
    ) ];
  }
}
