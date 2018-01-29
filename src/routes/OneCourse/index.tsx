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
  get one() {
    return this.props.$OneCourse!.one;
  }

  @computed
  get descriptionsList(): IDescriptionItem[] {
    return [
      {
        term: '教师',
        key: 'teacher',
        icon: 'contacts',
        value: this.one.teacher
      },
      {
        term: '学期',
        key: 'school_year',
        icon: 'calendar',
        value: `${this.one.school_year} ${this.one.term}`
      },
      {
        term: '我的角色',
        key: 'my-role',
        icon: 'user',
        value: RoleMap[ this.one.role ]
      }
    ];
  }

  @computed
  get loading() {
    const { $OneCourse } = this.props;
    return !$OneCourse!.isOneCourseLoaded;
  }

  componentDidMount() {
    const { $OneCourse, match } = this.props;
    const courseId = Number.parseInt(match.params.course_id);
    $OneCourse!.LoadOneCourse(courseId);
  }

  render() {
    const { match, $OneCourse } = this.props;

    return (
      <PageWithHeader
        loading={ this.loading }
        title={ `${this.one.creator.realname} / ${this.one.course_name}` }
        badgeStatus={ this.one.status === 'open' ? 'success' : 'error' }
        badgeText={ CourseStatusMap[ this.one.status ] }
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
