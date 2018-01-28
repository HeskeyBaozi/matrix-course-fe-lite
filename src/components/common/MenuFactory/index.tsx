import { GlobalModel } from '@/models/global.model';
import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';

export interface IMenuItem {
  key: string;
  icon: string;
  title: string;
}

interface IMenuFactoryProps<P> {
  menuList: IMenuItem[];
  returnTo?: (params: P) => string;
}

interface IGeneralMenuProps<P> extends RouteComponentProps<P> {
  $Global?: GlobalModel;
}

const generalPathRegexp = /\/?$/;

export default function MenuFactory<P = {}>({ menuList, returnTo }: IMenuFactoryProps<P>) {

  const mappedList = menuList.map(({ key, icon, title }) => (
    <Menu.Item key={ key }>
      <Icon type={ icon }/>
      <span>{ title }</span>
    </Menu.Item>
  ));

  const keys = menuList.map(({ key }) => key);

  return inject('$Global')
  (observer(
    class GeneralMenu extends React.Component<IGeneralMenuProps<P>> {
      navigate = ({ key }: ClickParam) => {
        const { history, match, location } = this.props;
        const urlToEnd = new RegExp(`${match.url}.*$`);
        if (key === 'RETURN' && returnTo) {
          history.push(returnTo(match.params));
        } else {
          const generalPath = match.url.replace(generalPathRegexp, '');
          if (`${generalPath}${key}` !== location.pathname) {
            console.log('push to ', `${generalPath}${key}`);
            history.push(`${generalPath}${key}`);
          }
        }
      }

      render() {
        const { $Global, location, match } = this.props;
        const pathSnippets = location.pathname.split('/').filter((i) => i);
        const urls = [ '/', ...pathSnippets.map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`) ];
        const selectedKeys = keys.filter((key, index) => {
          const generalKey = `${match.url.replace(generalPathRegexp, '')}${key}`;
          return (urls.some((url) => url === generalKey && url !== '/')
            || generalKey === match.url && urls.indexOf(match.url) === -1
            || generalKey === match.url && generalKey === '/' && urls.length === 1);
        });

        const children = returnTo ?
          [ (
            <Menu.Item className={ styles.returnItem } key={ 'RETURN' }>
              <Icon type={ 'rollback' }/>
              <span>{ '返回上一级' }</span>
            </Menu.Item>
          ), ...mappedList ]
          : mappedList;

        return (
          <Menu
            className={ styles.menu }
            theme={ 'dark' }
            inlineCollapsed={ $Global!.collapsed }
            onClick={ this.navigate }
            mode={ 'inline' }
            selectedKeys={ selectedKeys }
          >
            { children }
          </Menu>
        );
      }
    }
  ));
}
