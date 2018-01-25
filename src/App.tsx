import { ILoginQueryResult, ILoginSuccessData } from '@/api/interface';
import RenderAuthorizeRoute from '@/components/common/Authorized';
import Loading from '@/components/common/Loading/index';
import { LoginModel } from '@/models/login.model';
import { BasicLayout, LoginLayout } from '@/utils/dynamic';
import { history } from '@/utils/history';
import { notification } from 'antd';
import { observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import React from 'react';
import { Router, Switch } from 'react-router';

interface IAppProps {
  $Login?: LoginModel;
}

@inject('$Login')
@observer
export class App extends React.Component<IAppProps, {}> {

  @observable
  isLoading = true;

  componentDidMount() {
    this.initializeFlow();
  }

  @asyncAction
  * initializeFlow() {
    this.isLoading = true;
    const result: ILoginQueryResult = yield this.props.$Login!.QueryLoginStatus();
    if (result.status === 'OK') {
      const realname = result.data && (result.data as ILoginSuccessData).realname;
      notification.success({
        description: realname && `欢迎你, ${realname}` || `欢迎你`,
        duration: 1,
        message: '欢迎回来'
      });
    }
    this.isLoading = false;
  }

  render() {
    const { $Login } = this.props;
    const { AuthorizedRoute } = RenderAuthorizeRoute($Login!.isLogin ? 'USER' : 'GUEST');

    return (
      <div>
        <Loading isLoading={ this.isLoading } isFullScreen={ true } />
        <Router history={ history }>
          <Switch>
            <AuthorizedRoute
              path={ '/login' }
              component={ LoginLayout }
              authority={ 'GUEST' }
              redirectPath={ '/' }
            />
            <AuthorizedRoute
              path={ '/' }
              component={ BasicLayout }
              authority={ 'USER' }
              redirectPath={ '/login' }
            />
          </Switch>
        </Router>
      </div>
    );
  }
}
