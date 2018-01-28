import CodeBlock from '@/components/common/CodeBlock';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { Card, Col, Row } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingSubmitProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingSubmit extends React.Component<IProgrammingSubmitProps> {

  render() {
    const code = `
#include "binary.h"

namespace binary
{

int convert(std::string const& text)
{
    int result = 0;
    if (text.length() > sizeof(int)*8-1) {
        return 0;
    }
    for (const char x : text) {
        result <<=  1;
        if (x == '1') {
            result |= 1;
        } else if (x != '0') {
            return 0;
        }
    }
    return result;
}

}`;
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 } style={ { marginBottom: '1rem' } }>
          <Card>
            <CodeBlock value={ code } readOnly={ false }/>
          </Card>
        </Col>
        <Col lg={ 12 } md={ 24 } sm={ 24 } xs={ 24 }>
          <Card>456</Card>
        </Col>
      </Row>
    );
  }
}
