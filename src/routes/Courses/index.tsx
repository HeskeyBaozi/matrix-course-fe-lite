import PageHeader from '@/components/common/PageHeader';
import { breadcrumbNameMap } from '@/constants';
import { ItabItem } from '@/types';
import { observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';
import CoursesList from './List';

interface ICourseRouteProps extends RouteComponentProps<{}> {

}

const tabList: ItabItem[] = [
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
export default class CourseRoute extends React.Component<ICourseRouteProps> {

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
  }

  render() {
    const { location, match } = this.props;
    const breadcrumb = {
      breadcrumbNameMap,
      location
    };
    return (
      <div className={ styles.innerContainer }>
        <PageHeader
          tabList={ tabList }
          linkElement={ Link }
          tabActiveKey={ location.pathname.replace(`${match.path}/`, '') }
          onTabChange={ this.handleTabChange }
          title={ '所有课程' }
          {...breadcrumb}
        />
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
