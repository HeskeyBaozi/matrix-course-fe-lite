import React from 'react';
import { observer } from 'mobx-react';
import styles from './login.layout.less';
import { Layout } from 'antd';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { dynamic } from '@/utils/dynamic';

const LoginComponent = dynamic(() => import('@/components/Login/login.component'));


interface LoginLayoutProps extends RouteComponentProps<{}> {

}

@observer
export default class LoginLayout extends React.Component<LoginLayoutProps> {

  componentDidMount() {

  }

  render() {
    const { match } = this.props;
    return (
      <Layout className={ styles.container }>
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
