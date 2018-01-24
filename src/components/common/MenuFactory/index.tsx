import React from 'react';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import styles from './index.less';
import { RouteComponentProps } from 'react-router';

export interface MenuItem {
  key: string;
  icon: string;
  title: string;
}

interface MenuFactoryProps {
  menuList: MenuItem[];
  returnTo?: boolean | string;
}

interface GeneralMenuProps<P> extends RouteComponentProps<P> {
  collapsed: boolean;
}

const generalPathRegexp = /\/$/;

export default function MenuFactory<P = {}>({
                                              menuList,
                                              returnTo,
                                            }: MenuFactoryProps) {

  const mappedList = menuList.map(({ key, icon, title }) => (
    <Menu.Item key={ key }>
      <Icon type={ icon }/>
      <span>{ title }</span>
    </Menu.Item>
  ));

  const keys = menuList.map(({ key }) => key);

  return class GeneralMenu extends React.PureComponent<GeneralMenuProps<P>> {
    navigate = ({ key }: ClickParam) => {
      const { history, match, location } = this.props;
      if (key === 'RETURN') {
        if (typeof returnTo === 'string') {
          history.push(returnTo);
        } else if (typeof returnTo === 'boolean') {
          history.push(location.pathname.replace(match.url, '/'));
        } else {
          throw new TypeError(`returnTo should be string or boolean, but got ${typeof returnTo}`);
        }
      } else {
        const generalPath = match.url.replace(generalPathRegexp, '');
        history.push(`${generalPath}${key}`);
      }
    };

    render() {
      const { collapsed, location, match } = this.props;
      const pathSnippets = location.pathname.split('/').filter(i => i);
      const urls = ['/', ...pathSnippets.map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`)];
      const selectedKeys = keys.filter((key, index) => {
        const generalKey = `${match.url.replace(generalPathRegexp, '')}${key}`;
        return (urls.some(url => url === generalKey && url !== '/')
          || generalKey === match.url && urls.indexOf(match.url) === -1
          || generalKey === match.url && generalKey === '/' && urls.length === 1);
      });
      return (
        <Menu className={ styles.menu } theme={ 'dark' }
              inlineCollapsed={ collapsed }
              onClick={ this.navigate }
              mode={ 'inline' } selectedKeys={ selectedKeys }>
          { returnTo ? [(
            <Menu.Item className={ styles.returnItem } key={ 'RETURN' }>
              <Icon type={ 'rollback' }/>
              <span>{ '返回上一级' }</span>
            </Menu.Item>
          ), ...mappedList] : mappedList }
        </Menu>
      );
    }
  }
}
