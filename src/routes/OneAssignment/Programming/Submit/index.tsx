import { OneAssignmentModel } from '@/models/one-assignment.model';
import { Card, Col, Row } from 'antd';
import * as codemirror from 'codemirror';
import 'codemirror/mode/clike/clike';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { IInstance, UnControlled as CodeMirror } from 'react-codemirror2';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  @observable
  code = `#include <iostream>
using namespace std;

int main() {
	cout << "Hello" << endl;
	return 0;
}`;

  @action
  onBeforeChange = (editor: IInstance, data: codemirror.EditorChange, value: string) => {
    this.code = value;
  }

  @action
  onChange = (editor: IInstance, data: codemirror.EditorChange, value: string) => {
    console.log(editor, data, value);
  }

  @computed
  get CodeOptions() {
    return {
      mode: 'text/x-c++src',
      theme: 'github',
      tabSize: 2,
      lineNumbers: true,
      // readOnly: 'nocursor',
      foldGutter: true
    };
  }

  render() {
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <Card>
            <CodeMirror
              value={ this.code }
              options={ this.CodeOptions }
              onChange={ this.onChange }
            />
          </Card>
        </Col>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 }>
          <Card>456</Card>
        </Col>
      </Row>
    );
  }
}
