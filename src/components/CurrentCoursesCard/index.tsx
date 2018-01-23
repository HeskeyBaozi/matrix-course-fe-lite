import React from 'react';
import { observer } from 'mobx-react';
import { Tooltip, Icon } from 'antd';
import FieldCard from '@/components/FieldCard';

interface CurrentCoursesCardProps {

}

@observer
export default class CurrentCoursesCard extends React.Component<CurrentCoursesCardProps> {
  render() {
    return (
      <FieldCard
        title={ '正在进行课程数' }
        icon={ 'book' }
        total={ 2 }
        hoverable
        action={ <Tooltip title="指标说明"><Icon type="info-circle-o"/></Tooltip> }/>
    );
  }
}
