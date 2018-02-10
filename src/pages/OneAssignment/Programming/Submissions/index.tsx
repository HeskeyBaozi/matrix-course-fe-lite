import { OneAssignmentModel } from '@/models/one-assignment.model';
import Submissions from '@/pages/OneAssignment/Common/Submissions';
import { ProgrammingModel } from '@/pages/OneAssignment/Programming/model';
import { ProgrammingKeys } from '@/types/constants';
import { inject, observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import React from 'react';

interface IProgrammingSubmissionsProps {
  $OneAssignment?: OneAssignmentModel;
  $$Programming?: ProgrammingModel;
}

@inject('$OneAssignment', '$$Programming')
@observer
export default class ProgrammingSubmissions extends React.Component<IProgrammingSubmissionsProps> {

  @asyncAction
  * LoadOneSubmissionFromHistory(subCaId: number) {
    const { $OneAssignment, $$Programming } = this.props;
    $OneAssignment!.changeTab(ProgrammingKeys.GradeFeedback);
    yield $$Programming!.LoadOneSubmission({
      course_id: $OneAssignment!.assignment.course_id,
      ca_id: $OneAssignment!.assignment.ca_id,
      sub_ca_id: subCaId
    });
  }

  getClickHandler = (subCaId: number) => () => {
    this.LoadOneSubmissionFromHistory(subCaId);
  }

  render() {
    return (
      <Submissions getClickHandler={ this.getClickHandler }/>
    );
  }
}
