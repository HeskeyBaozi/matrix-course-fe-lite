import { GlobalModel } from '@/models/global.model';
import { Icon, Menu } from 'antd';
import { ClickParam } from 'antd/es/menu';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import styles from './index.less';
import { extendObservable } from 'mobx';

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
  return inject('$Global')
  (observer(
    class GeneralMenu extends React.Component<IGeneralMenuProps<P>> {
      collapsed: boolean;
      children: any[];
      selectedKeys: string[];
      keys: string[];
      returnTo: (params: P) => string;
      mappedList: any[];

      constructor(props: IGeneralMenuProps<P>) {
        super(props);
        extendObservable(this, {
          get menuList() {
            return menuList;
          },

          get mappedList() {
            return this.menuList.map(({ key, icon, title }) => (
              <Menu.Item key={ key }>
                <Icon type={ icon }/>
                <span>{ title }</span>
              </Menu.Item>
            ));
          },
          get returnTo() {
            return returnTo;
          },
          get keys() {
            return this.menuList.map(({ key }) => key);
          },
          get selectedKeys(): string[] {
            const { location, match } = props;
            const pathSnippets = location.pathname.split('/').filter((i) => i);
            const urls = [ '/', ...pathSnippets.map((_, index) => `/${pathSnippets.slice(0, index + 1).join('/')}`) ];
            return this.keys.filter((key, index) => {
              const generalKey = `${match.url.replace(generalPathRegexp, '')}${key}`;
              return (urls.some((url) => url === generalKey && url !== '/')
                || generalKey === match.url && urls.indexOf(match.url) === -1
                || generalKey === match.url && generalKey === '/' && urls.length === 1);
            });
          },
          get children() {
            return this.returnTo ?
              [ (
                <Menu.Item className={ styles.returnItem } key={ 'RETURN' }>
                  <Icon type={ 'rollback' }/>
                  <span>{ '返回上一级' }</span>
                </Menu.Item>
              ), ...this.mappedList ]
              : this.mappedList;
          },
          get collapsed() {
            return props.$Global!.collapsed;
          }
        });
      }

      navigate = ({ key }: ClickParam) => {
        const { history, match, location } = this.props;
        if (key === 'RETURN' && this.returnTo) {
          history.push(this.returnTo(match.params));
        } else {
          const generalPath = match.url.replace(generalPathRegexp, '');
          if (`${generalPath}${key}` !== location.pathname) {
            history.push(`${generalPath}${key}`);
          }
        }
      }

      render() {
        return (
          <Menu
            className={ styles.menu }
            theme={ 'dark' }
            inlineCollapsed={ this.collapsed }
            onClick={ this.navigate }
            mode={ 'inline' }
            selectedKeys={ this.selectedKeys }
          >
            { this.children }
          </Menu>
        );
      }
    }
  ));
}
