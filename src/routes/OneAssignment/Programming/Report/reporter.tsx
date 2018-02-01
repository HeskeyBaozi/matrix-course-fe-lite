import CodeBlock from '@/components/common/CodeBlock';
import DescriptionList from '@/components/common/DescriptionList';
import { IProgrammingConfig, IProgrammingReport } from '@/types/api';
import { TestResultMapper } from '@/types/constants';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Alert, Badge, Col, Collapse, Row } from 'antd';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';

const { Panel } = Collapse;

interface IProgrammingReporterProps {
  report: IProgrammingReport;
  config: IProgrammingConfig;
}

@observer
export default class ProgrammingReporter extends React.Component<IProgrammingReporterProps> {

  @computed
  get report() {
    return this.props.report;
  }

  @computed
  get config() {
    return this.props.config;
  }

  @computed
  get allChecks(): [ 'compile check', 'memory check', 'standard tests',
    'static check', 'random tests', 'google tests' ] {
    return [ 'compile check', 'memory check', 'standard tests', 'static check', 'random tests', 'google tests' ];
  }

  @computed
  get defaultExpandKeys() {
    return this.allChecks.filter((key) => {
      return this.config.grading[ key ] && this.report[ key ] && this.report[ key ]!.grade < this.config.grading[ key ];
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
          text={ `${report.grade} / ${grading}` }
        /></span>
      );
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const description = isContinue ?
        'Pass compilation. You got full score!' : 'Compilation fail.';
      const Code = isContinue ? null : (
        <div style={ { padding: '.5rem' } }>
          <code>{ report[ 'compile check' ] || '' }</code>
        </div>);
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
          text={ `${report.grade} / ${grading}` }
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
          text={ `${report.grade} / ${grading}` }
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
              <strong style={ { color: '#d73a49' } }>{ TestResultMapper[ result ] }</strong>
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

          const stdInput = result !== 'IE' ? (
            <div style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Input</div>
              <CodeBlock value={ stdin } readOnly={ true }/>
            </div>
          ) : null;

          const stdOutput = result !== 'RE' && result !== 'TL' && result !== 'IE' ? (
            <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Expected Output</div>
              <CodeBlock value={ standard_stdout || '' } readOnly={ true }/>
            </Col>
          ) : null;

          const myOutput = result !== 'RE' && result !== 'TL' && result !== 'IE' ? (
            <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Your Output</div>
              <CodeBlock value={ stdout } readOnly={ true }/>
            </Col>
          ) : null;

          const hintMessage = result === 'IE'
            ? 'Malicious code detected! Please Check your code.' +
            ' Make sure that there are no malicious codes and then submit again.'
            : `With the above input, your program has "${TestResultMapper[ result ]}" error.`;

          const hint = result === 'RE' || result === 'TL' || result === 'IE' ? (
            <Alert showIcon={ true } type={ 'error' } message={ hintMessage }/>
          ) : null;

          return (
            <Panel header={ panelHeader } key={ `${index + 1}` }>
              <DescriptionList title={ null } col={ 2 } style={ { marginBottom: '1rem' } }>
                { descriptions.map(descriptionRender) }
              </DescriptionList>
              { stdInput }
              <Row gutter={ 16 }>
                { myOutput }
                { stdOutput }
              </Row>
              { hint }
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

  @computed
  get RandomTests(): ReactNode {
    const report = this.report[ 'random tests' ];
    if (report) {
      const grading = this.config.grading[ 'random tests' ];
      const isContinue = report.grade === grading;
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const header = (
        <span>{ 'Random Tests' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
          text={ `${report.grade} / ${grading}` }
        /></span>
      );
      const description = (report.grade === grading
        ? 'Pass random check. You got full score!'
        : 'Some examples of failed in random test cases.');
      const logs = report[ 'random tests' ]
        .filter(({ result }) => result !== 'CR')
        .map(({
                result, stdin, stdout, standard_stdout,
                memoryused, memorylimit, timelimit, timeused
              },
              index) => {
          const panelHeader = (
            <span>
              <span style={ { marginRight: '.5rem' } }>{ `Case ${index + 1}: ` }</span>
              <strong style={ { color: '#d73a49' } }>{ TestResultMapper[ result ] }</strong>
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

          const stdInput = result !== 'IE' ? (
            <div style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Input</div>
              <CodeBlock value={ stdin } readOnly={ true }/>
            </div>
          ) : null;

          const stdOutput = result !== 'RE' && result !== 'TL' && result !== 'IE' ? (
            <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Expected Output</div>
              <CodeBlock value={ standard_stdout || '' } readOnly={ true }/>
            </Col>
          ) : null;

          const myOutput = result !== 'RE' && result !== 'TL' && result !== 'IE' ? (
            <Col xl={ 12 } lg={ 24 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
              <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Your Output</div>
              <CodeBlock value={ stdout } readOnly={ true }/>
            </Col>
          ) : null;

          const hintMessage = result === 'IE'
            ? 'Malicious code detected! Please Check your code.' +
            ' Make sure that there are no malicious codes and then submit again.'
            : `With the above input, your program has "${TestResultMapper[ result ]}" error.`;

          const hint = result === 'RE' || result === 'TL' || result === 'IE' ? (
            <Alert showIcon={ true } type={ 'error' } message={ hintMessage }/>
          ) : null;

          return (
            <Panel header={ panelHeader } key={ `${index + 1}` }>
              <DescriptionList title={ null } col={ 2 } style={ { marginBottom: '1rem' } }>
                { descriptions.map(descriptionRender) }
              </DescriptionList>
              { stdInput }
              <Row gutter={ 16 }>
                { myOutput }
                { stdOutput }
              </Row>
              { hint }
            </Panel>
          );
        });
      const collapse = logs.length ? (
        <Collapse accordion={ true } defaultActiveKey={ [ '1' ] }>
          { logs }
        </Collapse>
      ) : null;
      return grading ? (
        <Panel key={ 'random tests' } header={ header } style={ { border: '0' } }>
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

  @computed
  get MemoryCheck(): ReactNode {
    const report = this.report[ 'memory check' ];
    if (report) {
      const grading = this.config.grading[ 'memory check' ];
      const isContinue = report.grade === grading;
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const header = (
        <span>{ 'Memory Check' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
          text={ `${report.grade} / ${grading}` }
        /></span>
      );
      const description = report.grade === grading
        ? 'Pass memory access check. You got full score!'
        : 'Memory check fail. You might want to reproduce the ' +
        'errors locally with "valgrind --leak-check=full --track-origins=yes ./a.out"';

      const check = report[ 'memory check' ].find((one) => !!(one.valgrindoutput && one.valgrindoutput.error));
      let logs = null;
      if (check) {
        const msg = check.message ? (
          <Alert
            showIcon={ true }
            type={ 'warning' }
            message={ check.message }
            style={ { marginBottom: '.5rem' } }
          />) : null;
        const stdInput = (
          <div style={ { marginBottom: '1rem' } }>
            <div style={ { fontSize: '1.3rem', marginBottom: '.5rem' } }>Input</div>
            <CodeBlock value={ check.stdin } readOnly={ true }/>
          </div>
        );
        const errors = check.valgrindoutput.error.map(({ kind, stack: { frame }, what }, index) => {
          const panelHeader = (
            <span>
              <span style={ { marginRight: '.5rem' } }>{ `Error ${index + 1}: ` }</span>
              <strong style={ { color: '#d73a49' } }>{ kind }</strong>
            </span>
          );

          const behaviour = what ? (
            <Alert
              showIcon={ true }
              type={ 'warning' }
              message={ what }
              style={ { marginBottom: '.5rem' } }
            />) : null;

          const text = frame.map(({ file, line, fn }) => {
            const mark = file && line ? `[ ${file} ]: Line ${line}` : '';
            return mark ? `${mark}\n  ${fn}` : `${fn}`;
          }).join('\n');

          return (
            <Panel header={ panelHeader } key={ `${index + 1}` }>
              { behaviour }
              <CodeBlock value={ text } readOnly={ true } markdown={ true }/>
            </Panel>
          );
        });

        const link = (
          <a
            target='_blank'
            href='http://valgrind.org/docs/manual/mc-manual.html'
          >{ 'http://valgrind.org/docs/manual/mc-manual.html' }
          </a>
        );

        logs = (
          <div>
            { msg }
            { stdInput }
            <Alert
              showIcon={ true }
              message={ 'What do the error messages mean?' }
              style={ { marginBottom: '.5rem' } }
              description={ link }
            />
            <Collapse accordion={ true } defaultActiveKey={ [ '1' ] }>
              { errors }
            </Collapse>
          </div>
        );
      }
      return grading ? (
          <Panel key={ 'memory check' } header={ header } style={ { border: '0' } }>
            <Alert
              showIcon={ true }
              type={ isContinue ? 'success' : 'error' }
              message={ message }
              style={ { marginBottom: '.5rem' } }
              description={ description }
            />
            { logs }
          </Panel>
        ) :
        null;
    }
    return null;
  }

  @computed
  get GoogleTest(): ReactNode {
    const report = this.report[ 'google tests' ];
    if (report) {
      const grading = this.config.grading[ 'google tests' ];
      const isContinue = report.grade === grading;
      const message = `You Get ${report.grade} Points of ${grading} Points.`;
      const header = (
        <span>{ 'Google Tests' } <Badge
          style={ { marginLeft: '.3rem' } }
          status={ isContinue ? 'success' : 'error' }
          text={ `${report.grade} / ${grading}` }
        /></span>
      );
      const description = report.grade === grading
        ? 'Pass Google test. You got full score!'
        : 'Google test fail.';
      const check = report[ 'google tests' ].find((one) => !!(one.gtest && one.gtest.failure));
      let logs = null;
      if (check) {

        const msg = check.message ? (
          <Alert
            showIcon={ true }
            type={ 'warning' }
            message={ check.message }
            style={ { marginBottom: '.5rem' } }
          />) : null;

        const failures = check.gtest.failure.map((dict) => {
          const fnName = Object.keys(dict)[ 0 ];
          const value = dict[ fnName ];
          return [ fnName, value ];
        }) as Array<[ string, number ]>;

        const text = check.gtest.info
          ? failures.map(([ fnName, value ]) => {
            return `[ failure ] ${fnName}: ${check.gtest.info[ fnName ]} - ${value} points.`;
          }).join('\n')
          : `Error : ${check.gtest.failure[ 0 ].error}`;

        logs = (
          <div>
            { msg }
            <CodeBlock value={ text } markdown={ true } readOnly={ true }/>
          </div>
        );
      }
      return grading ? (
          <Panel key={ 'google tests' } header={ header } style={ { border: '0' } }>
            <Alert
              showIcon={ true }
              type={ isContinue ? 'success' : 'error' }
              message={ message }
              style={ { marginBottom: '.5rem' } }
              description={ description }
            />
            { logs }
          </Panel>
        ) :
        null;
    }
    return null;
  }

  render() {
    return (
      <Collapse bordered={ false } defaultActiveKey={ this.defaultExpandKeys }>
        { this.CompileCheck }
        { this.StaticCheck }
        { this.StandardTests }
        { this.RandomTests }
        { this.MemoryCheck }
        { this.GoogleTest }
      </Collapse>
    );
  }
}
