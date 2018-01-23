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

interface LoginLayoutProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
}

const { Header, Sider, Content } = Layout;

@inject('$Profile')
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
    this.props.$Profile!.LoadProfile();
  }

  navigate = ({ key }: ClickParam) => {
    const { history } = this.props;
    history.push(key);
  };

  render() {
    const { match, location } = this.props;
    const rootPath = match.path;
    return (
      <Layout>
        <Sider breakpoint={ 'md' } className={ styles.sider } trigger={ null } collapsible
               collapsed={ this.collapsed }>
          <div className={ styles.logoWrapper }>
            <img src={ logoTransUrl } alt={ 'logo' }/>
          </div>
          <Menu className={ styles.menu } theme={ 'dark' }
                onClick={ this.navigate }
                mode="inline" defaultSelectedKeys={ ['1'] }
                selectedKeys={ [location.pathname] }
                inlineCollapsed={ this.collapsed }>
            <Menu.Item key={ `${rootPath}` }>
              <Icon type={ 'home' }/>
              <span>概览</span>
            </Menu.Item>
            <Menu.Item key={ `${rootPath}courses` }>
              <Icon type={ 'book' }/>
              <span>课程</span>
            </Menu.Item>
            <Menu.Item key={ `${rootPath}notification` }>
              <Icon type="bell"/>
              <span>消息</span>
            </Menu.Item>
            <Menu.Item key={ `${rootPath}setting` }>
              <Icon type="setting"/>
              <span>设置</span>
            </Menu.Item>
            <Menu.Item key={ `${rootPath}feedback` }>
              <Icon type="smile-o"/>
              <span>反馈</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={ classNames(styles.contentLayout, { [styles.contentLayoutCollapsed]: this.collapsed }) }>
          <Header className={ classNames(styles.contentHeader, { [styles.contentHeaderCollapsed]: this.collapsed }) }>
            <Icon className={ styles.trigger } type={ this.collapsed ? 'menu-unfold' : 'menu-fold' }
                  onClick={ this.toggle }/>
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
              <Route key={ 'profile' } exact path={ `${rootPath}` } component={ ProfileRoute }/>
              <Route key={ 'course' } path={ `${rootPath}courses` } component={ CourseRoute }/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
