import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';

interface CourseRouteProps extends RouteComponentProps<{}> {

}


@observer
export default class CourseRoute extends React.Component<CourseRouteProps> {
  render() {
    return (
      <div>Course</div>
    );
  }
}

