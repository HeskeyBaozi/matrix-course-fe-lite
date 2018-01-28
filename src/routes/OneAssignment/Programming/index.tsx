import { OneAssignmentModel } from '@/models/one-assignment.model';
import ProgrammingDescription from '@/routes/OneAssignment/Programming/Description';
import ProgrammingSubmit from '@/routes/OneAssignment/Programming/Submit';
import { ProgrammingKeys } from '@/types/constants';
import { IDescriptionItem } from '@/utils/helpers';
import { Tabs } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

export interface IProgrammingConfig {
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

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  render() {
    return (
      <Tabs
        activeKey={ this.activeKey }
        tabBarStyle={ { display: 'none' } }
      >
        <TabPane key={ ProgrammingKeys.Description } tab={ ProgrammingKeys.Description }>
          <ProgrammingDescription/>
        </TabPane>
        <TabPane key={ ProgrammingKeys.Submit } tab={ ProgrammingKeys.Submit }>
          <ProgrammingSubmit/>
        </TabPane>
        <TabPane key={ ProgrammingKeys.Recordings } tab={ ProgrammingKeys.Recordings }>
          Recording
        </TabPane>
      </Tabs>
    );
  }
}
