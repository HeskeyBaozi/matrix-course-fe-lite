import React from 'react';
import { inject, observer } from 'mobx-react';
import { LoginModel } from '@/models/login.model';
import { Loading } from '@/components/Loading/loading.component';
import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import RenderAuthorizeRoute from '@/components/Authorized'
import { Router, Switch } from 'react-router';
import { history } from '@/utils/history';
import { dynamic } from '@/utils/dynamic';
import { Layout,notification } from 'antd';
import { LoginQueryResult } from '@/api/user';

const LoginLayout = dynamic(() => import('@/layouts/Login/login.layout'));
const BasicLayout = dynamic(() => import('@/layouts/Basic/basic.layout'));

interface AppProps {
  $Login?: LoginModel
}

@inject('$Login')
@observer
export class App extends React.Component<AppProps, {}> {

  @observable
  isLoading = true;

  componentDidMount() {
    this.initializeFlow();
  }

  @asyncAction
  * initializeFlow() {
    this.isLoading = true;
    const result: LoginQueryResult = yield this.props.$Login!.QueryLoginStatus();
    if(result.status === 'OK') {
      const realname = result.data && result.data.realname;
      notification.success({
        message: '欢迎回来',
        description: realname && `欢迎你, ${realname}` || `欢迎你`
      })
    }
    this.isLoading = false;
  }

  render() {
    const { $Login } = this.props;
    const { AuthorizedRoute } = RenderAuthorizeRoute($Login!.isLogin ? 'USER' : 'GUEST');

    return (
      <div>
        <Loading isLoading={ this.isLoading } isFullScreen />
        <Router history={ history }>
          <Switch>
            <AuthorizedRoute
              path={ '/login' }
              render={ props => <LoginLayout { ...props } /> }
              authority={ 'GUEST' }
              redirectPath={ '/' }
            />
            <AuthorizedRoute
              path={ '/' }
              render={ props => <BasicLayout { ...props } /> }
              authority={ 'USER' }
              redirectPath={ '/login' }
            />
          </Switch>
        </Router>
      </div>
    );
  }
}


