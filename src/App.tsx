import React from 'react';
import { inject, observer } from 'mobx-react';
import { LoginModel } from '@/models/login.model';
import { Loading } from '@/components/Loading/loading.component';
import { observable } from 'mobx';
import { asyncAction } from 'mobx-utils';
import RenderAuthorizeRoute from '@/components/Authorized'
import { HashRouter as Router, Switch } from 'react-router-dom';
import { dynamic } from '@/utils/dynamic';

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
    this.initialize();
  }

  @asyncAction
  * initialize() {
    this.isLoading = true;
    yield this.props.$Login!.QueryLoginStatus();
    this.isLoading = false;
  }

  render() {
    const { $Login } = this.props;
    const { AuthorizedRoute } = RenderAuthorizeRoute($Login!.isLogin ? 'USER' : 'GUEST');

    return (
      <div>
        <Loading isLoading={ this.isLoading } isFullScreen/>
        <Router>
          <Switch>
            <AuthorizedRoute
              path={ '/login' }
              render={ props => <LoginLayout { ...props }/> }
              authority={ 'GUEST' }
              redirectPath={ '/' }
            />
            <AuthorizedRoute
              path={ '/' }
              render={ props => <BasicLayout { ...props }/> }
              authority={ 'USER' }
              redirectPath={ '/login' }
            />
          </Switch>
        </Router>
      </div>
    );
  }
}


