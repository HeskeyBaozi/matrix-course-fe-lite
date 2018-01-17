import React from 'react';
import { observer } from 'mobx-react';
import styles from './login.layout.less';
import { Layout } from 'antd';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { dynamic } from '@/utils/dynamic';
import logoUrl from '@/assets/images/logo.svg';

const LoginComponent = dynamic(() => import('@/components/Login/login.component'));
const ParticlesComponent = dynamic(() => import('@/components/Particles/particles.component'));

interface LoginLayoutProps extends RouteComponentProps<{}> {
}

@observer
export default class LoginLayout extends React.Component<LoginLayoutProps> {


  render() {
    const { match } = this.props;
    return (
      <Layout className={ styles.container }>
        <ParticlesComponent/>
        <img className={ styles.logo } src={ logoUrl } alt={ 'logo' }/>
        <div className={ styles.inner }>
          <Switch>
            <Route key={ 'login' } exact path={ `${match.path}` }
                   component={ LoginComponent }/>
            <Redirect to={ { key: 'login' } }/>
          </Switch>
        </div>
      </Layout>
    );
  }
}
