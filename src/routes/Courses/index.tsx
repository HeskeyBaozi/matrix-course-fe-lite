import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps } from 'react-router';
import PageHeader from '@/components/PageHeader';
import styles from './index.less';
import { Link } from 'react-router-dom';

interface CourseRouteProps extends RouteComponentProps<{}> {

}

const breadcrumbNameMap = {
  '/courses': { name: '课程', href: '/courses' }
};

@observer
export default class CourseRoute extends React.Component<CourseRouteProps> {
  render() {
    return (
      <div className={ styles.innerContainer }>
        <PageHeader linkElement={ Link } { ...{ breadcrumbNameMap, ...this.props } }/>
        <div style={ { width: 30, height: 1000, backgroundColor: 'lightblue' } }></div>
      </div>
    );
  }
}

