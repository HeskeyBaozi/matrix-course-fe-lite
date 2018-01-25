import FieldCard from '@/components/common/FieldCard';
import { CoursesModel } from '@/models/courses.model';
import { Icon, Tooltip } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';

interface ICurrentCoursesCardProps {
  $Courses?: CoursesModel;
}

@inject('$Courses')
@observer
export default class CurrentCoursesCard extends React.Component<ICurrentCoursesCardProps> {
  render() {
    const { $Courses } = this.props;
    return (
      <FieldCard
        title={ '正在进行课程数' }
        icon={ 'book' }
        times={ '门' }
        total={ $Courses!.openCount }
        hoverable={ true }
        loading={ !$Courses!.isCoursesLoaded }
        action={ <Tooltip title='指标说明'><Icon type='info-circle-o' /></Tooltip> }
      />
    );
  }
}
