import React from 'react';
import { observer } from 'mobx-react';
import { RouteComponentProps, Switch, Route, Redirect } from 'react-router';
import PageHeader from '@/components/PageHeader';
import styles from './index.less';
import CoursesList from './List';
import { Link } from 'react-router-dom';

interface CourseRouteProps extends RouteComponentProps<{}> {

}

const breadcrumbNameMap: BreadCrumbNameMap = {
  '/courses': { name: '课程', href: '/courses' }
};

const tabList: tabItem[] = [
  {
    key: 'open',
    tab: '进行中'
  },
  {
    key: 'close',
    tab: '已关闭'
  }
];

@observer
export default class CourseRoute extends React.Component<CourseRouteProps> {

  handleTabChange = (key: string) => {
    const { match, history } = this.props;
    switch (key) {
      case 'open':
        history.push(`${match.path}/open`);
        break;
      case 'close':
        history.push(`${match.path}/close`);
        break;
      default:
        break;
    }
  };

  render() {
    const { location, match } = this.props;
    const breadcrumb = {
      location, breadcrumbNameMap
    };
    return (
      <div className={ styles.innerContainer }>
        <PageHeader
          tabList={ tabList }
          linkElement={ Link }
          tabActiveKey={ location.pathname.replace(`${match.path}/`, '') }
          onTabChange={ this.handleTabChange }
          title={ '所有课程' } {...breadcrumb} />
        <div className={ styles.containContainer }>
          <Switch>
            <Route path={ `${match.path}/:status` } component={ CoursesList } />
            <Redirect to={ `${match.path}/open` } />
          </Switch>
        </div>
      </div>
    );
  }
}

interface BreadCrumbNameMap {
  [ path: string ]: {
    name: string;
    href: string;
  }
}

interface tabItem {
  key: string;
  tab: string;
}