import MutableCodeEditor, { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { IProgrammingConfig } from '@/routes/OneAssignment/Programming';
import { IAssignment } from '@/types/api';
import { Card, Col, Icon, Row } from 'antd';
import { autorun, computed, extendObservable, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  @observable
  answers: ICodeEditorDataSource = {};

  componentDidMount() {
    autorun(() => {
      Object.keys(this.answers).forEach((key) => {
        console.log(this.answers[ key ].value);
      });
    });
  }

  @computed
  get assignment(): IAssignment<IProgrammingConfig> {
    return this.props.$OneAssignment!.assignment;
  }

  @computed
  get answerFiles(): ICodeEditorDataSource {
    return this.assignment.config.submission.reduce((acc, filename) => extendObservable(acc, {
      [ filename ]: {
        readOnly: false,
        value: ''
      }
    }), this.answers);
  }

  @computed
  get supportFiles(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = {};
    return (this.assignment.files || []).reduce((acc, file) => extendObservable(acc, {
      [ file.name ]: {
        readOnly: true,
        value: file.code
      }
    }), start);
  }

  @computed
  get isSupportFilesEmpty() {
    return this.assignment.files && !this.assignment.files.length || !this.assignment.files;
  }

  render() {

    const supportFiles = !this.isSupportFilesEmpty ? (
      <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
        <Card>
          <MutableCodeEditor
            mutableDataSource={ this.supportFiles }
            extra={ <span><Icon type={ 'file-text' }/> 只读文件</span> }
          />
        </Card>
      </Col>
    ) : null;

    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col
          lg={ !this.isSupportFilesEmpty ? 12 : 24 }
          md={ 24 }
          sm={ 24 }
          xs={ 24 }
          style={ { marginBottom: '1rem' } }
        >
          <Card>
            <MutableCodeEditor
              mutableDataSource={ this.answerFiles }
              extra={ <span><Icon type={ 'file' }/> 待提交文件</span> }
            />
          </Card>
        </Col>
        { supportFiles }
      </Row>
    );
  }
}
