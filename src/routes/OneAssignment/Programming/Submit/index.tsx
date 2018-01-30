import MutableCodeEditor, { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { IProgrammingConfig } from '@/routes/OneAssignment/Programming';
import { IAssignment } from '@/types/api';
import { Button, Card, Col, Icon, Row, Switch } from 'antd';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import styles from './index.less';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  @observable
  isTowFlow = false;

  @observable
  answers: ICodeEditorDataSource = new Map();

  @computed
  get loading() {
    return !this.props.$OneAssignment!.isDetailLoaded;
  }

  @computed
  get config(): IProgrammingConfig {
    return this.props.$OneAssignment!.assignment.config;
  }

  @computed
  get assignment(): IAssignment<IProgrammingConfig> {
    return this.props.$OneAssignment!.assignment;
  }

  @computed
  get answerFiles(): ICodeEditorDataSource {
    return (this.loading ? [] : this.config.submission.slice())
      .reduce((acc, filename) => {
        acc.set(filename, observable({
          readOnly: false,
          value: ''
        }));
        return acc;
      }, this.answers);
  }

  @computed
  get supportFiles() {
    const start: ICodeEditorDataSource = new Map();
    return (this.assignment.files || [])
      .reduce((acc, file) => {
        acc.set(file.name, {
          readOnly: true,
          value: file.code
        });
        return acc;
      }, start);
  }

  @computed
  get isSupportFilesEmpty() {
    return this.assignment.files && !this.assignment.files.length || !this.assignment.files;
  }

  @computed
  get AnswersAreaResponsiveColProps() {
    return {
      lg: this.isTowFlow ? (!this.isSupportFilesEmpty ? 12 : 24) : 24,
      md: 24, sm: 24, xs: 24, style: { marginBottom: '1rem' }
    };
  }

  @computed
  get SupportFilesEditor() {
    return (
      this.isTowFlow && !this.isSupportFilesEmpty ? (
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <Card loading={ this.loading }>
            <MutableCodeEditor
              mutableDataSource={ this.supportFiles }
              extraDataSource={ null }
              extra={ <span><Icon type={ 'file-text' }/> 只读文件</span> }
            />
          </Card>
        </Col>
      ) : null
    );
  }

  @computed
  get baseText() {
    return this.isTowFlow ? '待提交文件' : '所有文件';
  }

  @computed
  get ToggleSwitch() {
    return this.isSupportFilesEmpty ? null : (
      <Switch
        checkedChildren={ '双栏' }
        unCheckedChildren={ '单栏' }
        checked={ this.isTowFlow }
        onChange={ this.onTwoFlowChange }
      />
    );
  }

  @action
  onTwoFlowChange = (checked: boolean) => {
    this.isTowFlow = checked;
  }

  @computed
  get Extra() {
    return (
      <span
        style={ { display: 'flex', alignItems: 'center' } }
      ><Icon type={ 'file' }/><span style={ { margin: '0 .5rem 0 .3rem' } }>{ this.baseText }</span>
        { this.ToggleSwitch }
      </span>
    );
  }

  @computed
  get extraDataSource() {
    return this.isTowFlow ? null : this.supportFiles;
  }

  render() {
    return (
      <Row className={ styles.codemirror } type={ 'flex' } gutter={ 16 }>
        <Col { ...this.AnswersAreaResponsiveColProps }>
          <Card loading={ this.loading }>
            <MutableCodeEditor
              mutableDataSource={ this.answerFiles }
              extraDataSource={ this.extraDataSource }
              extra={ this.Extra }
            />
            <div style={ { marginTop: '1rem', display: 'flex', flexFlow: 'row-reverse nowrap' } }>
              <Button type={ 'primary' } htmlType={ 'submit' } icon={ 'upload' }>Submit</Button>
            </div>
          </Card>
        </Col>
        { this.SupportFilesEditor }
      </Row>
    );
  }
}
