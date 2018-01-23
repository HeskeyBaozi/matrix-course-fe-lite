import React from 'react';
import { inject, observer } from 'mobx-react';
import { LoginModel } from '@/models/login.model';
import Loading from '@/components/Loading/index';
import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import RenderAuthorizeRoute from '@/components/Authorized'
import { Router, Switch } from 'react-router';
import { history } from '@/utils/history';
import { LoginLayout, BasicLayout } from '@/utils/dynamic';
import { notification } from 'antd';
import { LoginQueryResult, LoginSuccessData } from '@/api/interface';


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
    if (result.status === 'OK') {
      const realname = result.data && (result.data as LoginSuccessData).realname;
      notification.success({
        message: '欢迎回来',
        description: realname && `欢迎你, ${realname}` || `欢迎你`,
        duration: 1
      })
    }
    this.isLoading = false;
  }

  render() {
    const { $Login } = this.props;
    const { AuthorizedRoute } = RenderAuthorizeRoute($Login!.isLogin ? 'USER' : 'GUEST');

    return (
      <div>
        <Loading isLoading={ this.isLoading } isFullScreen/>
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


