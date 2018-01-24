import React from 'react';
import { observer, inject } from 'mobx-react';
import { Tooltip, Icon } from 'antd';
import FieldCard from '@/components/FieldCard';
import { CoursesModel } from '@/models/courses.model';

interface CurrentCoursesCardProps {
  $Courses?: CoursesModel;
}

@inject('$Courses')
@observer
export default class CurrentCoursesCard extends React.Component<CurrentCoursesCardProps> {
  render() {
    const { $Courses } = this.props;
    return (
      <FieldCard
        title={ '正在进行课程数' }
        icon={ 'book' }
        times={ '门' }
        total={ $Courses!.openCount }
        hoverable
        action={ <Tooltip title="指标说明"><Icon type="info-circle-o" /></Tooltip> } />
    );
  }
}
