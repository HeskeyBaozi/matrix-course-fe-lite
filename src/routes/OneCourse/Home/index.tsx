import { observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IOneCourseHomeProps extends RouteComponentProps<{}> {

}

@observer
export default class OneCourseHome extends React.Component<IOneCourseHomeProps> {
  render() {
    // tslint:disable-next-line:no-console
    console.log(this.props.match.params);
    return (
      <div>Home</div>
    );
  }
}
