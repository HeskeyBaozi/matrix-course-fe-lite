import { AssignmentTimeStatusMap, AssignmentTimeStatusTextMap } from '@/api/interface';
import DescriptionList from '@/components/common/DescriptionList';
import Loading from '@/components/common/Loading';
import PageHeader from '@/components/common/PageHeader';
import { breadcrumbNameMap } from '@/constants';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { descriptionRender, formatter, getBadgeStatus, IDescriptionItem } from '@/utils/helpers';
import { Avatar, Badge, Progress } from 'antd';
import { format } from 'date-fns/esm';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router';
import { Link } from 'react-router-dom';
import styles from './index.less';

interface IOneAssignmentParams {
  ca_id: string;
  course_id: string;
}

interface IOneAssignment extends RouteComponentProps<IOneAssignmentParams> {
  $OneAssignment?: OneAssignmentModel;
}

const test = () => <div>Home</div>;

@inject('$OneAssignment')
@observer
export default class OneAssignment extends React.Component<IOneAssignment> {

  componentDidMount() {
    const { $OneAssignment, match } = this.props;
    const { ca_id, course_id } = match.params;
    $OneAssignment!.LoadOneAssignment({
      ca_id: Number.parseInt(ca_id),
      course_id: Number.parseInt(course_id)
    });
  }

  render() {
    const { $OneAssignment, match, location } = this.props;
    const { assignment, last } = $OneAssignment!;
    const breadcrumb = { breadcrumbNameMap, location };
    const percent = (last.grade || 0) * 100 / assignment.standard_score;
    const status = getBadgeStatus($OneAssignment!.hasLastSubmission, last.grade, assignment.standard_score);
    const title = (
      <div className={ styles.titleWrapper }>
        <Loading
          isLoading={ !$OneAssignment!.isBaseInformationLoaded }
          isFullScreen={ false }
        />
        <span>{ assignment.title }</span>
        <Badge
          className={ styles.badgeStatus }
          status={ AssignmentTimeStatusMap[ $OneAssignment!.timeStatus ] }
          text={ AssignmentTimeStatusTextMap[ $OneAssignment!.timeStatus ] }
        />
      </div>
    );

    const descriptions: IDescriptionItem[] = [
      {
        term: '题型',
        key: 'assignment-type',
        icon: 'info-circle-o',
        value: assignment.type
      },
      {
        term: '截止日期',
        key: 'ddl',
        icon: 'calender',
        value: format(assignment.enddate, 'HH:mm A, Do MMM. YYYY')
      },
      {
        term: '提交次数限制',
        key: 'submission-limits',
        icon: 'upload',
        value: assignment.submit_limitation || 'No Limits'
      },
      {
        term: '出题人',
        key: 'creator',
        icon: 'contacts',
        value: assignment.author.realname
      }
    ];

    const progressStatus = $OneAssignment!.hasLastSubmission && last.grade !== null ?
      (percent >= 60 ? 'success' : 'exception') : 'active';

    const content = (
      <DescriptionList
        key={ 'description' }
        style={ { marginBottom: '1.5rem' } }
        title={ null }
        col={ 2 }
      >
        { descriptions.map(descriptionRender) }
      </DescriptionList>
    );
    return (
      <div style={ { margin: '-1.5rem' } }>
        <PageHeader
          linkElement={ Link }
          logo={ <Avatar icon={ 'edit' } src={ '' }/> }
          title={ title }
          content={ content }
          style={ { position: 'relative' } }
          { ...breadcrumb }
        />
        <div style={ { padding: '1.5rem' } }>
          <Switch>
            <Route path={ `${match.url}/home` } component={ test }/>
            <Redirect to={ `${match.url}/home` }/>
          </Switch>
        </div>
      </div>
    );
  }
}
