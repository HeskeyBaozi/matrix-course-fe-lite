import DescriptionList from '@/components/common/DescriptionList';
import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { IProgrammingConfig } from '@/routes/OneAssignment/Programming';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Card, Col, Row } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface IProgrammingDescriptionProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class ProgrammingDescription extends React.Component<IProgrammingDescriptionProps> {

  @computed
  get programmingLimits(): IDescriptionItem[] {
    const { config }: { config: IProgrammingConfig } = this.props.$OneAssignment!.assignment;
    return [
      { term: '时间限制', key: 'time-limits', icon: 'clock-circle-o', value: `${config.limits.time} ms` },
      { term: '内存限制', key: 'space-limits', icon: 'database', value: `${config.limits.memory} MBytes` }
    ];
  }

  render() {
    const { assignment, isDetailLoaded } = this.props.$OneAssignment!;
    return (
      <Row type={ 'flex' } gutter={ 16 }>
        <Col
          lg={ { span: 18, order: 1 } }
          sm={ { span: 24, order: 2 } }
          xs={ { span: 24, order: 2 } }
        >
          <Card title={ '题目描述' } loading={ !isDetailLoaded }>
            <Markdown source={ assignment.description }/>
          </Card>
        </Col>
        <Col
          lg={ { span: 6, order: 2 } }
          sm={ { span: 24, order: 1 } }
          xs={ { span: 24, order: 1 } }
          style={ { marginBottom: '1rem' } }
        >
          <Card title={ '题目要求' } loading={ !isDetailLoaded }>
            <DescriptionList title={ null } col={ 1 }>
              { this.programmingLimits.map(descriptionRender) }
            </DescriptionList>
          </Card>
        </Col>
      </Row>
    );
  }
}
