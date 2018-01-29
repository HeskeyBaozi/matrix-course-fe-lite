import MutableCodeEditor, { ICodeEditorDataSource } from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { IProgrammingConfig } from '@/routes/OneAssignment/Programming';
import { Card, Col, Icon, Row } from 'antd';
import { autorun, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  @computed
  get config(): IProgrammingConfig {
    return this.props.$OneAssignment!.assignment.config;
  }

  @computed
  get submission(): ICodeEditorDataSource {
    const start: ICodeEditorDataSource = {};
    return this.config.submission.reduce((acc, filename) => {
      acc[ filename ] = {
        readOnly: false,
        value: ''
      };
      return acc;
    }, start);
  }

  render() {
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <Card>
            <MutableCodeEditor
              mutableDataSource={ this.submission }
              extra={ <span><Icon type={ 'file' }/> 待提交文件</span> }
            />
          </Card>
        </Col>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 }>
          <Card>
            <MutableCodeEditor
              mutableDataSource={ {} }
              extra={ <span><Icon type={ 'file-text' }/> 关联文件</span> }
            />
          </Card>
        </Col>
      </Row>
    );
  }
}
