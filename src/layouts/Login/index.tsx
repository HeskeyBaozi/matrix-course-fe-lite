import logoUrl from '@/assets/images/logo.svg';
import GlobalFooter from '@/components/common/GlobalFooter';
import { LoginRoute, ParticlesComponent } from '@/utils/dynamic';
import { Icon, Layout } from 'antd';
import { observer } from 'mobx-react';
import React, { ReactNode } from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import styles from './index.less';

interface ILink {
  key: string;
  title: ReactNode;
  href: string;
  blankTarget?: boolean;
}

const links: ILink[] = [
  {
    blankTarget: true,
    href: 'https://about.vmatrix.org.cn/',
    key: 'about-us',
    title: '关于我们'
  },
  {
    blankTarget: true,
    href: 'https://blog.vmatrix.org.cn/',
    key: 'blog',
    title: '技术博客'
  }
];

const copyright = <div>Copyright <Icon type={ 'copyright' }/> VMatrix</div>;

interface ILoginLayoutProps extends RouteComponentProps<{}> {
}

@observer
export default class LoginLayout extends React.Component<ILoginLayoutProps> {

  render() {
    const { match } = this.props;
    return (
      <Layout className={ styles.container }>
        <ParticlesComponent/>
        <img className={ styles.logo } src={ logoUrl } alt={ 'logo' }/>
        <div className={ styles.inner }>
          <Switch>
            <Route path={ `${match.url}` } component={ LoginRoute }/>
            <Redirect to={ `${match.url}` }/>
          </Switch>
        </div>
        <div className={ styles.footer }>
          <GlobalFooter links={ links } copyright={ copyright }/>
        </div>
      </Layout>
    );
  }
}
