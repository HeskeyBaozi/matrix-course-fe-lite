import { CourseStatusMap, RoleMap } from '@/api/interface';
import { fetchAvatar } from '@/api/user';
import DescriptionList from '@/components/common/DescriptionList';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import { breadcrumbNameMap } from '@/constants';
import { OneCourseModel } from '@/models/one-course.model';
import { OneCourseHomeRoute } from '@/utils/dynamic';
import { Avatar, Badge, Col, Icon, Row } from 'antd';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

const { Description } = DescriptionList;

interface IOneCourseRouteProps extends RouteComponentProps<{ courseId: string }> {
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

  componentWillUnmount() {
    const { $OneCourse } = this.props;
    $OneCourse!.releaseCreatorAvatarUrl();
  }

  componentDidMount() {
    const { $OneCourse, match } = this.props;
    const courseId = Number.parseInt(match.params.courseId);
    $OneCourse!.LoadOneCourse(courseId);
  }

  render() {
    const { match, location, $OneCourse } = this.props;
    const { one } = $OneCourse!;
    const breadcrumb = { breadcrumbNameMap, location };
    const title = (
      <div className={ styles.titleWrapper }>
        <div className={ styles.left }>
          <span>{ `${one.creator.realname} / ${one.course_name}` }</span>
        </div>
        <div className={ styles.right }>
          <Badge status={ one.status === 'open' ? 'success' : 'error' } text={ CourseStatusMap[ one.status ] } />
        </div>
      </div>
    );

    const content = [ (
      <DescriptionList
        key={ 'basic' }
        style={ { marginBottom: '1.5rem' } }
        title={ null }
        col={ 3 }
      >
        <Description term={ <span><Icon type={ 'contacts' } /> 教师</span> }>
          { one.teacher }
        </Description>
        <Description term={ <span><Icon type={ 'calendar' } /> 学期</span> }>
          { `${one.school_year} ${one.term}` }
        </Description>
        <Description term={ <span><Icon type={ 'user' } /> 我的角色</span> }>
          { RoleMap[ one.role ] }
        </Description>
      </DescriptionList>
    ) ];

    return (
      <div className={ styles.innerContainer }>
        <Loading
          isLoading={ !$OneCourse!.isOneCourseLoaded }
          modifyClassName={ styles.modifyLoading }
          isFullScreen={ false }
        />
        <PageHeader
          key={ 'pageHeader' }
          linkElement={ Link }
          style={ { position: 'relative' } }
          logo={ <Avatar icon={ 'user' } src={ this.displayAvatarUrl } /> }
          title={ title }
          content={ content }
          {...breadcrumb}
        />
        <div key={ 'route' } className={ styles.containContainer }>
          <Switch>
            <Route path={ `${match.url}/home` } component={ OneCourseHomeRoute } />
            <Redirect to={ `${match.url}/home` } />
          </Switch>
        </div>
      </div>
    );
  }
}
