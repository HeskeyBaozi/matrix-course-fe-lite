import FieldCard from '@/components/common/FieldCard';
import { Icon, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';

// tslint:disable-next-line:no-empty-interface
interface IDeadlinesCardProps {

}

@observer
export default class DeadlinesCard extends React.Component<IDeadlinesCardProps> {
  render() {
    return (
      <FieldCard
        title={ '作业未提交个数' }
        icon={ 'meh-o' }
        times={ '个' }
        total={ 4 }
        hoverable={ true }
        action={ <Tooltip title='指标说明'><Icon type='info-circle-o' /></Tooltip> }
      />
    );
  }
}
