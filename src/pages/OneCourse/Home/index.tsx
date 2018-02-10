import Markdown from '@/components/common/Markdown';
import { OneCourseModel } from '@/models/one-course.model';
import { Card } from 'antd';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IOneCourseHomeProps extends RouteComponentProps<{}> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseHome extends React.Component<IOneCourseHomeProps> {
  render() {
    const { $OneCourse } = this.props;
    const { one } = $OneCourse!;
    return (
      <Card
        loading={ !$OneCourse!.isOneCourseLoaded }
        title={ '课程信息' }
      >
        <Markdown source={ one.description || '这个老师很懒，什么都没留下...' }/>
      </Card>
    );
  }
}
