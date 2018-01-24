import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';
import PageHeader from '@/components/common/PageHeader';
import { breadcrumbNameMap } from '@/constants';
import { OneCourseModel } from '@/models/one-course.model';
import Loading from '@/components/common/Loading';
import { Avatar, Icon, Row, Col, Badge } from 'antd';
import { computed, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { fetchAvatar } from '@/api/user';
import { CourseStatusMap, RoleMap } from '@/api/interface';
import DescriptionList from '@/components/common/DescriptionList';

const { Description } = DescriptionList;

interface OneCourseRouteProps extends RouteComponentProps<{ courseId: string }> {
  $OneCourse?: OneCourseModel;
}


@inject('$OneCourse')
@observer
export default class OneCourseRoute extends React.Component<OneCourseRouteProps> {

  @observable
  avatarUrl = '';

  @computed
  get displayAvatarUrl() {
    return this.avatarUrl.length ? this.avatarUrl : void 0;
  }

  @asyncAction
  * LoadAvatar() {
    const { $OneCourse } = this.props;
    const { username } = $OneCourse!.one.creator;
    const { data }: { data: Blob } = yield fetchAvatar(username);
    this.avatarUrl = URL.createObjectURL(data);
  }


  componentWillUnmount() {
    URL.revokeObjectURL(this.avatarUrl);
  }

  async componentDidMount() {
    const { $OneCourse, match } = this.props;
    const courseId = Number.parseInt(match.params.courseId);
    await $OneCourse!.LoadOneCourse(courseId);
    await this.LoadAvatar();
  }


  render() {
    const { match, location, $OneCourse } = this.props;
    const { one } = $OneCourse!;
    const breadcrumb = {
      location, breadcrumbNameMap
    };
    const title = (
      <div className={ styles.titleWrapper }>
        <div className={ styles.left }>
          <span>{ `${one.creator.realname} / ${one.course_name}` }</span>
        </div>
        <div className={ styles.right }>
          <Badge status={ one.status === 'open' ? 'success' : 'error' } text={ CourseStatusMap[one.status] }/>
        </div>
      </div>
    );

    const content = [
      <DescriptionList key={ 'basic' } style={ { marginBottom: '1.5rem' } }
                       title={ null } col={ 3 }>
        <Description term={ <span><Icon type={ 'contacts' }/> 教师</span> }>
          { one.teacher }
        </Description>
        <Description term={ <span><Icon type={ 'calendar' }/> 学期</span> }>
          { `${one.school_year} ${one.term}` }
        </Description>
        <Description term={ <span><Icon type={ 'user' }/> 我的角色</span> }>
          { RoleMap[one.role] }
        </Description>
      </DescriptionList>
    ];

    return (
      <div className={ styles.innerContainer }>
        <Loading isLoading={ !$OneCourse!.isOneCourseLoaded } modifyClassName={ styles.modifyLoading }
                 isFullScreen={ false }/>
        <PageHeader
          key={ 'pageHeader' }
          linkElement={ Link }
          style={ { position: 'relative' } }
          logo={ <Avatar icon={ 'user' } src={ this.displayAvatarUrl }/> }
          title={ title }
          content={ content }
          { ...breadcrumb } />
        <div key={ 'route' } className={ styles.containContainer }>
          <Switch>
            <Route path={ `${match.url}` } component={ () => <div>hello</div> }/>
          </Switch>
        </div>
      </div>
    );
  }
}
