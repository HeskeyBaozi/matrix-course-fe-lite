import CodeBlock from '@/components/common/CodeBlock';
import DescriptionList from '@/components/common/DescriptionList';
import Info from '@/components/common/Info';
import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import ScoreBar from '@/components/common/ScoreBar';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import { IProgrammingConfig } from '@/types/api';
import { TestResultMapper } from '@/types/constants';
import { descriptionRender, IDescriptionItem, statusFromGrade } from '@/utils/helpers';
import { Alert, Badge, Button, Card, Col, Collapse, Row } from 'antd';
import { format } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React, { ReactNode } from 'react';

const { Panel } = Collapse;

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

  @computed
  get defaultExpandKeys() {
    return Object.keys(this.report).filter((key: string) => {
      return this.config.grading[ key ] && !this.report[ key ]!.continue
        || this.report[ key ] && this.report[ key ]!.grade < this.config.grading[ key ];
    });
  }

  @computed
  get CompileCheck(): ReactNode {
    const report = this.report[ 'compile check' ];

    if (report) {
      const grading = this.config.grading[ 'compile check' ];
      const isContinue = report.grade === grading;
      const header = (
        <span>{ 'Compile Check' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
        /></span>
      );
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const description = isContinue ?
        'Pass compilation. You got full score!' : 'Compilation fail.';
      const Code = isContinue ? null :
        <CodeBlock value={ report[ 'compile check' ] || '' } markdown={ true } readOnly={ true }/>;
      return grading ? (
        <Panel key={ 'compile check' } header={ header } style={ { border: '0' } }>
          <Alert
            showIcon={ true }
            type={ isContinue ? 'success' : 'error' }
            message={ message }
            style={ { marginBottom: '.5rem' } }
            description={ description }
          />
          { Code }
        </Panel>
      ) : null;
    }
    return null;
  }

  @computed
  get StaticCheck(): ReactNode {
    const report = this.report[ 'static check' ];
    if (report) {
      const grading = this.config.grading[ 'static check' ];
      const isContinue = report.grade === grading;
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const header = (
        <span>{ 'Static Check' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
        /></span>
      );
      const description = (report.grade === grading
        ? 'Pass static check. You got full score!'
        : 'Static check fail.');

      const violation = report[ 'static check' ].violation;
      const logs = violation
        .filter(({ rule, message: msg }) => rule || msg)
        .map(({ category, rule, message: msg, priority, path, startLine, startColumn }, i) => {
          const hash = typeof rule === 'string' ? `#${rule.toLowerCase().replace(/ /g, '')}` : '';
          const url = `http://docs.oclint.org/en/stable/rules/${category || 'index'}.html${hash}`;
          return (
            <div
              key={ `${priority}${path}${startLine}${startColumn}${rule}${i}` }
              style={ { color: priority < 3 ? 'red' : null, marginBottom: '.3rem' } }
            >
              <code>
                <span>{ `[ -${3 - priority} ] ${path}: ${startLine}:${startColumn}` }</span>
                <div>
                  <a target={ '_blank' } href={ url }>{ `${rule}${msg ? `: ${msg}` : ''}` }</a>
                </div>
              </code>
            </div>
          );
        });
      return grading ? (
        <Panel key={ 'static check' } header={ header } style={ { border: '0' } }>
          <Alert
            showIcon={ true }
            type={ isContinue ? 'success' : 'error' }
            message={ message }
            style={ { marginBottom: '.5rem' } }
            description={ description }
          />
          { logs }
        </Panel>
      ) : null;
    }
    return null;
  }

  @computed
  get StandardTests(): ReactNode {
    const report = this.report[ 'standard tests' ];
    if (report) {
      const grading = this.config.grading[ 'standard tests' ];
      const isContinue = report.grade === grading;
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const header = (
        <span>{ 'Standard Tests' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
        /></span>
      );
      const description = (report.grade === grading
        ? 'Pass standard test. You got full score!'
        : 'Some examples of failed in standard test cases.');
      const logs = report[ 'standard tests' ]
        .filter(({ result }) => result !== 'CR')
        .map(({
                result, stdin, stdout, standard_stdout,
                memoryused, memorylimit, timelimit, timeused
              },
              index) => {
          const panelHeader = (
            <span>
              <span style={ { marginRight: '.5rem' } }>{ `Case ${index + 1}: ` }</span>
              <strong style={ { color: 'red' } }>{ TestResultMapper[ result ] }</strong>
            </span>
          );
          const descriptions: IDescriptionItem[] = [];
          if (memoryused) {
            descriptions.push({ key: 'memory-used', icon: 'save', term: 'Memory Used', value: `${memoryused}KBytes` });
          }
          if (timeused) {
            descriptions.push({ key: 'time-used', icon: 'clock-circle-o', term: 'Time Used', value: `${timeused}ms` });
          }
          if (memorylimit) {
            descriptions.push({
              key: 'memory-limit',
              icon: 'save',
              term: 'Memory Limit',
              value: `${memorylimit}KBytes`
            });
          }
          if (timelimit) {
            descriptions.push({ key: 'time-limit', icon: 'clock-circle', term: 'Time Limit', value: `${timelimit}ms` });
          }
          return (
            <Panel header={ panelHeader } key={ `${index + 1}` }>
              <DescriptionList title={ null } col={ 2 }>
                { descriptions.map(descriptionRender) }
              </DescriptionList>
              <div style={ { marginBottom: '1rem' } }>
                <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Input</div>
                <CodeBlock value={ stdin } readOnly={ true }/>
              </div>
              <Row gutter={ 16 }>
                <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
                  <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Your Output</div>
                  <CodeBlock value={ stdout } readOnly={ true }/>
                </Col>
                <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
                  <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Expected Output</div>
                  <CodeBlock value={ standard_stdout || '' } readOnly={ true }/>
                </Col>
              </Row>
            </Panel>
          );
        });
      const collapse = logs.length ? (
        <Collapse accordion={ true } defaultActiveKey={ [ '1' ] }>
          { logs }
        </Collapse>
      ) : null;
      return grading ? (
        <Panel key={ 'standard tests' } header={ header } style={ { border: '0' } }>
          <Alert
            showIcon={ true }
            type={ isContinue ? 'success' : 'error' }
            message={ message }
            style={ { marginBottom: '.5rem' } }
            description={ description }
          />
          { collapse }
        </Panel>
      ) : null;
    }
    return null;
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
        <Collapse bordered={ false } defaultActiveKey={ this.defaultExpandKeys }>
          { this.CompileCheck }
          { this.StaticCheck }
          { this.StandardTests }
        </Collapse>
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
