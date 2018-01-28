import MutableCodeEditor from '@/components/common/MutableCodeEditor';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { Card, Col, Row } from 'antd';
import { autorun, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  @observable
  data = {
    'Date.cpp': {
      value: '',
      readOnly: false
    }
  };

  componentDidMount() {
    autorun(() => {
      console.log('autorun', this.data['Date.cpp'].value);
    });
  }

  render() {
    console.log(this.data);
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <Card>
            <MutableCodeEditor mutableDataSource={ this.data }/>
          </Card>
        </Col>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 }>
          <Card>456</Card>
        </Col>
      </Row>
    );
  }
}
