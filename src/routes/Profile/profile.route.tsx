import React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer } from 'mobx-react';

interface ProfileRouteProps extends RouteComponentProps<{}> {

}

@observer
export default class ProfileRoute extends React.Component<ProfileRouteProps> {
  render() {
    return (
      <div>Hello</div>
    );
  }
}
