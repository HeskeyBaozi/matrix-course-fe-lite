import React from 'react';
import { observer } from 'mobx-react';
import styles from './login.layout.less';
import { RouteComponentProps } from 'react-router';

interface LoginLayoutProps extends RouteComponentProps<{}> {

}

@observer
export default class LoginLayout extends React.Component<LoginLayoutProps> {

  componentDidMount() {
    console.log('this ', this.props);
  }

  render() {
    return (
      <div className={ styles.container }>
        Login23333333333333
      </div>
    );
  }
}
