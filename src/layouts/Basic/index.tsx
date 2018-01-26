import logoTransUrl from '@/assets/images/logo-trans.png';
import MenuFactory from '@/components/common/MenuFactory';
import { CoursesModel } from '@/models/courses.model';
import { ProfileModel } from '@/models/profile.model';
import { CoursesRoute, OneCourseRoute, ProfileRoute } from '@/utils/dynamic';
import { Avatar, Icon, Layout } from 'antd';
import classNames from 'classnames';
import { action, computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import styles from './index.less';

interface ILoginLayoutProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
  $Courses?: CoursesModel;
}

const { Header, Sider, Content } = Layout;

const FirstMenu = MenuFactory({
  menuList: [
    { key: '/', icon: 'home', title: '概览' },
    { key: '/courses', icon: 'book', title: '课程' },
    { key: '/notification', icon: 'bell', title: '消息' },
    { key: '/setting', icon: 'setting', title: '设置' },
    { key: '/feedback', icon: 'smile-o', title: '反馈' }
  ]
});

const OneCourseMenu = MenuFactory({
  menuList: [
    { key: '/', icon: 'area-chart', title: '详情概览' },
    { key: '/assignments', icon: 'edit', title: '作业' },
    { key: '/discussions', icon: 'coffee', title: '讨论' }
  ],
  returnTo: '/courses'
});

@inject('$Profile', '$Courses')
@observer
export default class BasicLayout extends React.Component<ILoginLayoutProps> {

  @observable
  collapsed = true;

  @action
  toggle = () => {
    this.collapsed = !this.collapsed;
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

  renderOneCourseMenu = (props: RouteComponentProps<{ courseId: string }>) => (
    <OneCourseMenu { ...props } collapsed={ this.collapsed }/>
  )

  renderFirstMenu = (props: RouteComponentProps<{}>) => <FirstMenu { ...props } collapsed={ this.collapsed }/>;

  render() {
    return (
      <Layout>
        <Sider
          breakpoint={ 'md' }
          className={ styles.sider }
          trigger={ null }
          collapsible={ true }
          collapsed={ this.collapsed }
        >
          <div className={ styles.logoWrapper }>
            <img src={ logoTransUrl } alt={ 'logo' }/>
          </div>
          <Switch>
            <Route
              path={ '/course/:courseId' }
              render={ this.renderOneCourseMenu }
            />
            <Route
              path={ '/' }
              render={ this.renderFirstMenu }
            />
          </Switch>
        </Sider>
        <Layout className={ classNames(styles.contentLayout, { [ styles.contentLayoutCollapsed ]: this.collapsed }) }>
          <Header className={ classNames(styles.contentHeader, { [ styles.contentHeaderCollapsed ]: this.collapsed }) }>
            <Icon
              className={ styles.trigger }
              type={ this.collapsed ? 'menu-unfold' : 'menu-fold' }
              onClick={ this.toggle }
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
              <Route path={ '/course/:courseId' } component={ OneCourseRoute }/>
              <Redirect to={ '/' }/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
