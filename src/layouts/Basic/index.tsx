import React from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Menu, Icon, Avatar } from 'antd';
import classNames from 'classnames';
import logoTransUrl from '@/assets/images/logo-trans.png';
import styles from './index.less';
import { RouteComponentProps, Switch, Route } from 'react-router';
import { action, observable, computed } from 'mobx';
import { ProfileModel } from '@/models/profile.model';
import { CourseRoute, ProfileRoute } from '@/utils/dynamic';
import { ClickParam } from 'antd/lib/menu';
import { CoursesModel } from '@/models/courses.model';
import MenuFactory, { MenuItem } from '@/components/MenuFactory';

interface LoginLayoutProps extends RouteComponentProps<{}> {
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
    { key: '/feedback', icon: 'smile-o', title: '反馈' },
  ], defaultSelectedKeys: [ '/' ]
});

@inject('$Profile', '$Courses')
@observer
export default class BasicLayout extends React.Component<LoginLayoutProps> {

  @observable
  collapsed = true;

  @action
  toggle = () => {
    this.collapsed = !this.collapsed;
  };

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

  navigate = ({ key }: ClickParam) => {
    const { history } = this.props;
    history.push(key);
  };

  render() {
    const { match, location, history } = this.props;
    const rootPath = match.path;
    return (
      <Layout>
        <Sider breakpoint={ 'md' } className={ styles.sider } trigger={ null } collapsible
          collapsed={ this.collapsed }>
          <div className={ styles.logoWrapper }>
            <img src={ logoTransUrl } alt={ 'logo' } />
          </div>
          <FirstMenu history={ history } collapsed={ this.collapsed } />
        </Sider>
        <Layout className={ classNames(styles.contentLayout, { [ styles.contentLayoutCollapsed ]: this.collapsed }) }>
          <Header className={ classNames(styles.contentHeader, { [ styles.contentHeaderCollapsed ]: this.collapsed }) }>
            <Icon className={ styles.trigger } type={ this.collapsed ? 'menu-unfold' : 'menu-fold' }
              onClick={ this.toggle } />
            <div className={ styles.right }>
              <span className={ styles.action }>
                <Icon type={ 'bell' } />
              </span>
              <span className={ styles.action }>
                <Avatar size={ 'large' } icon={ 'user' } src={ this.headerAvatarUrl } />
              </span>
            </div>
          </Header>
          <Content className={ styles.content }>
            <Switch>
              <Route key={ 'profile' } exact path={ `${rootPath}` } component={ ProfileRoute } />
              <Route key={ 'course' } path={ `${rootPath}courses` } component={ CourseRoute } />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
