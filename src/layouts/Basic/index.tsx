import React from 'react';
import { observer, inject } from 'mobx-react';
import { Layout, Menu, Icon, Avatar } from 'antd';
import classNames from 'classnames';
import logoTransUrl from '@/assets/images/logo-trans.png';
import styles from './index.less';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import { action, observable, computed } from 'mobx';
import { ProfileModel } from '@/models/profile.model';
import { ProfileRoute } from '@/utils/dynamic';

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

  render() {
    const { match } = this.props;
    return (
      <Layout>
        <Sider breakpoint={ 'md' } className={ styles.sider } trigger={ null } collapsible
               collapsed={ this.collapsed }>
          <div className={ styles.logoWrapper }>
            <img src={ logoTransUrl } alt={ 'logo' }/>
          </div>
          <Menu className={ styles.menu } theme={ 'dark' } mode="inline" defaultSelectedKeys={ ['1'] }
                inlineCollapsed={ this.collapsed }>
            <Menu.Item key="1">
              <Icon type="user"/>
              <span>概览</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera"/>
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload"/>
              <span>nav 3</span>
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
              <Route key={ 'profile' } exact path={ `${match.path}profile` } component={ ProfileRoute }/>
              <Redirect to={ `${match.path}profile` }/>
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
