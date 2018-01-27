import { CourseStatusMap, RoleMap } from '@/api/interface';
import DescriptionList from '@/components/common/DescriptionList';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import { breadcrumbNameMap } from '@/constants';
import { OneCourseModel } from '@/models/one-course.model';
import {
  OneCourseAssignmentsRoute, OneCourseDiscussionsRoute, OneCourseHomeRoute
} from '@/utils/dynamic';
import { descriptionRender, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Badge, Icon } from 'antd';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

interface IOneCourseRouteProps extends RouteComponentProps<{ course_id: string }> {
  $OneCourse?: OneCourseModel;
}

@inject('$OneCourse')
@observer
export default class OneCourseRoute extends React.Component<IOneCourseRouteProps> {

  @computed
  get displayAvatarUrl() {
    const { $OneCourse } = this.props;
    return $OneCourse!.creatorAvatarUrl.length ? $OneCourse!.creatorAvatarUrl : void 0;
  }

  componentDidMount() {
    const { $OneCourse, match } = this.props;
    const courseId = Number.parseInt(match.params.course_id);
    $OneCourse!.LoadOneCourse(courseId);
  }

  render() {
    const { match, location, $OneCourse } = this.props;
    const { one } = $OneCourse!;
    const breadcrumb = { breadcrumbNameMap, location };
    const title = (
      <div className={ styles.titleWrapper }>
        <Loading
          isLoading={ !$OneCourse!.isOneCourseLoaded }
          isFullScreen={ false }
        />
        <span>{ `${one.creator.realname} / ${one.course_name}` }</span>
        <Badge status={ one.status === 'open' ? 'success' : 'error' } text={ CourseStatusMap[ one.status ] }/>
      </div>
    );

    const descriptions: IDescriptionItem[] = [
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

    const content = (
      <DescriptionList
        key={ 'basic' }
        style={ { marginBottom: '1.5rem' } }
        title={ null }
        col={ 3 }
      >
        { descriptions.map(descriptionRender) }
      </DescriptionList>
    );

    return (
      <div style={ { margin: '-1.5rem' } }>
        <PageHeader
          linkElement={ Link }
          style={ { position: 'relative' } }
          logo={ <Avatar icon={ 'user' } src={ this.displayAvatarUrl }/> }
          title={ title }
          content={ content }
          { ...breadcrumb }
        />
        <div style={ { padding: '1.5rem' } }>
          <Switch>
            <Route path={ `${match.url}/home` } component={ OneCourseHomeRoute }/>
            <Route path={ `${match.url}/assignments` } component={ OneCourseAssignmentsRoute }/>
            <Route path={ `${match.url}/discussions` } component={ OneCourseDiscussionsRoute }/>
            <Redirect to={ `${match.url}/home` }/>
          </Switch>
        </div>
      </div>
    );
  }
}
