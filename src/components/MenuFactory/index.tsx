import React from 'react';
import { History } from 'history';
import { Menu, Icon } from 'antd';
import { ClickParam } from 'antd/lib/menu';
import styles from './index.less';

export interface MenuItem {
    key: string;
    icon: string;
    title: string;
}

interface MenuFactoryProps {
    menuList: MenuItem[];
    defaultSelectedKeys: string[];
}

interface GeneralMenuProps {
    history: History;
    collapsed: boolean;
}

export default function ({ menuList, defaultSelectedKeys }: MenuFactoryProps) {

    const list = menuList.map(({ key, icon, title }) => (
        <Menu.Item key={ key }>
            <Icon type={ icon } />
            <span>{ title }</span>
        </Menu.Item>
    ));

    return class GeneralMenu extends React.PureComponent<GeneralMenuProps> {
        navigate = ({ key }: ClickParam) => {
            const { history } = this.props;
            history.push(key);
        };

        render() {
            const { collapsed } = this.props;
            return (
                <Menu className={ styles.menu } theme={ 'dark' }
                    inlineCollapsed={ collapsed }
                    onClick={ this.navigate }
                    mode="inline" defaultSelectedKeys={ defaultSelectedKeys }>
                    { list }
                </Menu>
            );
        }
    }
}