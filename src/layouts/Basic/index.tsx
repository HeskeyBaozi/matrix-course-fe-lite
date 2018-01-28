import logoTransUrl from '@/assets/images/logo-trans.png';
import FirstMenu from '@/layouts/Basic/Menu';
import { CoursesModel } from '@/models/courses.model';
import { GlobalModel } from '@/models/global.model';
import { ProfileModel } from '@/models/profile.model';
import GeneralAssignmentMenu from '@/routes/OneAssignment/Menu';
import OneCourseMenu from '@/routes/OneCourse/Menu';
import { CoursesRoute, OneAssignmentRoute, OneCourseRoute, ProfileRoute } from '@/utils/dynamic';
import { Avatar, Icon, Layout } from 'antd';
import classNames from 'classnames';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import styles from './index.less';

interface ILoginLayoutProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
  $Courses?: CoursesModel;
  $Global?: GlobalModel;
}

const { Header, Sider, Content } = Layout;

@inject('$Profile', '$Courses', '$Global')
@observer
export default class BasicLayout extends React.Component<ILoginLayoutProps> {

  handleToggle = () => {
    const { $Global } = this.props;
    $Global!.toggle();
  }

  @computed
  get headerAvatarUrl() {
    const { $Profile } = this.props;
    return $Profile!.avatarUrl.length ? $Profile!.avatarUrl : void 0;
  }

  componentDidMount() {
    const { $Profile, $Courses } = this.props;
    Promise.all([
      $Profile!.LoadProfile(),
      $Courses!.LoadCoursesList()
    ]);
  }

  render() {
    const { $Global } = this.props;
    return (
      <Layout>
        <Sider
          breakpoint={ 'md' }
          className={ styles.sider }
          trigger={ null }
          collapsible={ true }
          collapsed={ $Global!.collapsed }
        >
          <div className={ styles.logoWrapper }>
            <img src={ logoTransUrl } alt={ 'logo' }/>
          </div>
          <Switch>
            <Route path={ '/course/:course_id/assignment/:ca_id' } component={ GeneralAssignmentMenu }/>
            <Route path={ '/course/:course_id' } component={ OneCourseMenu }/>
            <Route path={ '/' } component={ FirstMenu }/>
          </Switch>
        </Sider>
        <Layout
          className={ classNames(styles.contentLayout, { [ styles.contentLayoutCollapsed ]: $Global!.collapsed }) }
        >
          <Header
            className={ classNames(styles.contentHeader, { [ styles.contentHeaderCollapsed ]: $Global!.collapsed }) }
          >
            <Icon
              className={ styles.trigger }
              type={ $Global!.collapsed ? 'menu-unfold' : 'menu-fold' }
              onClick={ this.handleToggle }
            />
            <div className={ styles.right }>
              <span className={ styles.action }>
                <Icon type={ 'bell' }/>
              </span>
              <span className={ styles.action }>
                <Avatar size={ 'large' } icon={ 'user' } src={ this.headerAvatarUrl }/>
              </span>
            </div>
          </Header>
          <Content className={ styles.content }>
            <Switch>
              <Route exact={ true } path={ `/` } component={ ProfileRoute }/>
              <Route path={ `/courses` } component={ CoursesRoute }/>
              <Route path={ '/course/:course_id/assignment/:ca_id' } component={ OneAssignmentRoute }/>
              <Route path={ '/course/:course_id' } component={ OneCourseRoute }/>
              <Redirect to={ '/' }/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
