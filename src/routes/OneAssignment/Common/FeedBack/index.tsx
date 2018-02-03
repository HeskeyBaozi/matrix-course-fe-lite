import Info from '@/components/common/Info';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ISubmission } from '@/types/api';
import { statusFromGrade } from '@/utils/helpers';
import { Card, Col, Row } from 'antd';
import { format } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IFeedbackProps {
  $OneAssignment?: OneAssignmentModel;
  submission: ISubmission<any, any>;
  submitAt: string;
}

@inject('$OneAssignment')
@observer
export default class Feedback extends React.Component<IFeedbackProps> {

  @computed
  get isLastSubmission() {
    const { $OneAssignment } = this.props;
    const { submissions } = $OneAssignment!;
    const { sub_ca_id } = this.one;
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
    return this.props.$OneAssignment!.assignment.config;
  }

  @computed
  get one() {
    return this.props.submission;
  }

  @computed
  get formatTime() {
    return format(this.props.submitAt, 'YYYY-MM-DD HH:mmA');
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

  render() {
    const { children } = this.props;
    return this.isShown ? (
      <div>
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
        { children }
      </div>
    ) : (
      <Card>暂时没有任何记录</Card>
    );
  }
}
