import React from 'react';
import { observer } from 'mobx-react';
import { Layout, Menu, Icon } from 'antd';
import classNames from 'classnames';
import logoTransUrl from '@/assets/images/logo-trans.png';
import styles from './basic.layout.less';
import { RouteComponentProps } from 'react-router';
import { action, observable } from 'mobx';

interface LoginLayoutProps extends RouteComponentProps<{}> {

}

const { Header, Sider, Content } = Layout;

@observer
export default class BasicLayout extends React.Component<LoginLayoutProps> {

  @observable
  collapsed = true;


  @action
  toggle = () => {
    this.collapsed = !this.collapsed;
  };

  render() {
    return (
      <Layout>
        <Sider breakpoint={ 'md' } className={ styles.sider } trigger={ null } collapsible
          collapsed={ this.collapsed }>
          <div className={ styles.logoWrapper } >
            <img src={ logoTransUrl } alt={ 'logo' } />
          </div>
          <Menu className={ styles.menu } theme={ 'dark' } mode="inline" defaultSelectedKeys={ [ '1' ] }
            inlineCollapsed={ this.collapsed }>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>概览</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className={ classNames(styles.contentLayout, { [ styles.contentLayoutCollapsed ]: this.collapsed }) }>
          <Header className={ styles.contentHeader }>
            <Icon className={ styles.trigger } type={ this.collapsed ? 'menu-unfold' : 'menu-fold' }
              onClick={ this.toggle } />
          </Header>
          <Content className={ styles.content }>
            Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />
            Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />
            Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />
            Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />Content <br />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
