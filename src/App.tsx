import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { LoginModel } from '@/models/login.model';
import { Loading } from '@/components/Loading/loading.component';
import { autorun, observable } from 'mobx';
import { asyncAction } from 'mobx-utils';

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

    const { $Login } = this.props;
  }

  render() {
    const { $Login } = this.props;
    return (
      <div>
        <Loading isLoading={ this.isLoading } isFullScreen/>

      </div>
    );
  }
}


