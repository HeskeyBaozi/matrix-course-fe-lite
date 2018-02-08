import PageWithHeader from '@/components/common/PageWithHeader';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import { AssignmentTimeStatusMap, AssignmentTimeStatusTextMap } from '@/types/api';
import { PType } from '@/types/constants';
import {
  OneAssignmentChoiceRoute, OneAssignmentFileUploadRoute, OneAssignmentProgrammingRoute,
  OneAssignmentProgramOutputRoute, OneAssignmentReportRoute
} from '@/utils/dynamic';
import { format } from 'date-fns/esm';
import { computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { RouteComponentProps } from 'react-router';

interface IOneAssignmentParams {
  ca_id: string;
  course_id: string;
}

interface IOneAssignment extends RouteComponentProps<IOneAssignmentParams> {
  $OneAssignment?: OneAssignmentModel;
}

const Test = () => <div>HomeTest</div>;

@inject('$OneAssignment')
@observer
export default class OneAssignment extends React.Component<IOneAssignment> {

  @computed
  get $OneAssignment() {
    return this.props.$OneAssignment!;
  }

  @computed
  get descriptionsList() {
    const { assignment } = this.$OneAssignment;
    return [
      {
        term: '题型',
        key: 'assignment-type',
        icon: 'info-circle-o',
        value: assignment.type
      },
      {
        term: '截止日期',
        key: 'ddl',
        icon: 'calendar',
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
  }

  @computed
  get AssignmentView() {
    switch (this.$OneAssignment.isDetailLoaded && this.$OneAssignment.assignment.ptype_id) {
      case PType.Programming:
        return <OneAssignmentProgrammingRoute/>;
      case PType.Choice:
        return <OneAssignmentChoiceRoute/>;
      case PType.FileUpload:
        return <OneAssignmentFileUploadRoute/>;
      case PType.ProgramOutput:
        return <OneAssignmentProgramOutputRoute/>;
      case PType.Report:
        return <OneAssignmentReportRoute/>;
      default:
        return <Test/>;
    }
  }

  async componentDidMount() {
    const { match } = this.props;
    const { ca_id, course_id } = match.params;
    await this.$OneAssignment.LoadOneAssignment({
      ca_id: Number.parseInt(ca_id),
      course_id: Number.parseInt(course_id)
    });
  }

  componentWillUnmount() {
    this.$OneAssignment.resetTab();
  }

  render() {
    const { assignment } = this.$OneAssignment;
    return (
      <PageWithHeader
        loading={ !this.$OneAssignment.isDetailLoaded }
        title={ assignment.title }
        badgeStatus={ AssignmentTimeStatusMap[ this.$OneAssignment.timeStatus ] }
        badgeText={ AssignmentTimeStatusTextMap[ this.$OneAssignment.timeStatus ] }
        descriptionsList={ this.descriptionsList }
        col={ 2 }
      >
        { this.AssignmentView }
      </PageWithHeader>
    );
  }
}
