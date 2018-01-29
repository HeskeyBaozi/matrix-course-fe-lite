import logoUrl from '@/assets/images/logo.svg';
import GlobalFooter from '@/components/common/GlobalFooter';
import { LoginRoute, ParticlesComponent } from '@/utils/dynamic';
import { Icon, Layout } from 'antd';
import { computed } from 'mobx';
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

interface ILoginLayoutProps extends RouteComponentProps<{}> {
}

@observer
export default class LoginLayout extends React.Component<ILoginLayoutProps> {

  @computed
  get links(): ILink[] {
    return [
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
  }

  @computed
  get Logo() {
    return (
      <img className={ styles.logo } src={ logoUrl } alt={ 'logo' }/>
    );
  }

  @computed
  get Content() {
    const { match } = this.props;
    return (
      <div className={ styles.inner }>
        <Switch>
          <Route path={ `${match.url}` } component={ LoginRoute }/>
          <Redirect to={ `${match.url}` }/>
        </Switch>
      </div>
    );
  }

  @computed
  get Copyright() {
    return (
      <div>Copyright <Icon type={ 'copyright' }/> VMatrix</div>
    );
  }

  @computed
  get Footer() {
    return (
      <div className={ styles.footer }>
        <GlobalFooter links={ this.links } copyright={ this.Copyright }/>
      </div>
    );
  }

  render() {
    return (
      <Layout className={ styles.container }>
        <ParticlesComponent/>
        { this.Logo }
        { this.Content }
        { this.Footer }
      </Layout>
    );
  }
}
