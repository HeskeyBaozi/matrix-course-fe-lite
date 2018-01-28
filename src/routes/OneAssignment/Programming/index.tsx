import DescriptionList from '@/components/common/DescriptionList';
import Markdown from '@/components/common/Markdown';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { ProgrammingKeys } from '@/types/constants';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Card, Col, Row, Tabs } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

interface IProgrammingConfig {
  compilers: string[];
  limits: {
    memory: number;
    time: number;
  };
}

interface IProgrammingProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class Programming extends React.Component<IProgrammingProps> {

  @computed
  get programmingLimits(): IDescriptionItem[] {
    const { config }: { config: IProgrammingConfig } = this.props.$OneAssignment!.assignment;
    return [
      { term: '时间限制', key: 'time-limits', icon: 'clock-circle-o', value: `${config.limits.time} ms` },
      { term: '内存限制', key: 'space-limits', icon: 'database', value: `${config.limits.memory} MBytes` }
    ];
  }

  render() {
    const { $OneAssignment } = this.props;
    const { assignment } = $OneAssignment!;
    return (
      <Tabs
        activeKey={ $OneAssignment!.tabActiveKey }
        tabBarStyle={ { display: 'none' } }
      >
        <TabPane key={ ProgrammingKeys.Description } tab={ ProgrammingKeys.Description }>
          <Row type={ 'flex' } gutter={ 16 }>
            <Col
              lg={ { span: 18, order: 1 } }
              sm={ { span: 24, order: 2 } }
              xs={ { span: 24, order: 2 } }
            >
              <Card title={ '题目描述' }>
                <Markdown source={ assignment.description }/>
              </Card>
            </Col>
            <Col
              lg={ { span: 6, order: 2 } }
              sm={ { span: 24, order: 1 } }
              xs={ { span: 24, order: 1 } }
              style={ { marginBottom: '1rem' } }
            >
              <Card title={ '题目要求' }>
                <DescriptionList title={ null } col={ 1 }>
                  { this.programmingLimits.map(descriptionRender) }
                </DescriptionList>
              </Card>
            </Col>
          </Row>
        </TabPane>
        <TabPane key={ ProgrammingKeys.Recordings } tab={ ProgrammingKeys.Recordings }>
          Recording
        </TabPane>
      </Tabs>
    );
  }
}
