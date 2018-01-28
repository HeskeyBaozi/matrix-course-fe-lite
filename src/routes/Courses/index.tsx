import PageWithHeader from '@/components/common/PageWithHeader';
import { CoursesModel } from '@/models/courses.model';
import { ItabItem } from '@/types';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import CoursesList from './List';

interface ICourseRouteProps extends RouteComponentProps<{}> {
  $Courses?: CoursesModel;
}

@inject('$Courses')
@observer
export default class CourseRoute extends React.Component<ICourseRouteProps> {

  @computed
  get tabList(): ItabItem[] {
    return [
      {
        key: 'open',
        tab: '进行中'
      },
      {
        key: 'close',
        tab: '已关闭'
      }
    ];
  }

  handleTabChange = (key: string) => {
    const { match, history } = this.props;
    switch (key) {
      case 'open':
        history.push(`${match.url}/open`);
        break;
      case 'close':
        history.push(`${match.url}/close`);
        break;
      default:
        break;
    }
  }

  render() {
    const { $Courses, location, match } = this.props;
    return (
      <PageWithHeader
        title={ '所有课程' }
        loading={ !$Courses!.isCoursesLoaded }
        tabActiveKey={ location.pathname.replace(`${match.url}/`, '') }
        tabList={ this.tabList }
        onTabChange={ this.handleTabChange }
      >
        <Switch>
          <Route path={ `${match.url}/:status` } component={ CoursesList }/>
          <Redirect to={ `${match.url}/open` }/>
        </Switch>
      </PageWithHeader>
    );
  }
}
