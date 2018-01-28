import PageWithHeader from '@/components/common/PageWithHeader';
import { OneCourseModel } from '@/models/one-course.model';
import { CourseStatusMap, RoleMap } from '@/types/api';
import {
  OneCourseAssignmentsRoute, OneCourseDiscussionsRoute, OneCourseHomeRoute
} from '@/utils/dynamic';
import { IDescriptionItem } from '@/utils/helpers';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';

interface IOneCourseRouteProps extends RouteComponentProps<{ course_id: string }> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseRoute extends React.Component<IOneCourseRouteProps> {

  @computed
  get descriptionsList(): IDescriptionItem[] {
    const { one } = this.props.$OneCourse!;
    return [
      {
        term: '教师',
        key: 'teacher',
        icon: 'contacts',
        value: one.teacher
      },
      {
        term: '学期',
        key: 'school_year',
        icon: 'calendar',
        value: `${one.school_year} ${one.term}`
      },
      {
        term: '我的角色',
        key: 'my-role',
        icon: 'user',
        value: RoleMap[ one.role ]
      }
    ];
  }

  componentDidMount() {
    const { $OneCourse, match } = this.props;
    const courseId = Number.parseInt(match.params.course_id);
    $OneCourse!.LoadOneCourse(courseId);
  }

  render() {
    const { match, $OneCourse } = this.props;
    const { one } = $OneCourse!;

    return (
      <PageWithHeader
        loading={ !$OneCourse!.isOneCourseLoaded }
        title={ `${one.creator.realname} / ${one.course_name}` }
        badgeStatus={ one.status === 'open' ? 'success' : 'error' }
        badgeText={ CourseStatusMap[ one.status ] }
        descriptionsList={ this.descriptionsList }
        avatarIcon={ 'user' }
        avatarUrl={ $OneCourse!.creatorAvatarUrl }
      >
        <Switch>
          <Route path={ `${match.url}/home` } component={ OneCourseHomeRoute }/>
          <Route path={ `${match.url}/assignments` } component={ OneCourseAssignmentsRoute }/>
          <Route path={ `${match.url}/discussions` } component={ OneCourseDiscussionsRoute }/>
          <Redirect to={ `${match.url}/home` }/>
        </Switch>
      </PageWithHeader>
    );
  }
}
