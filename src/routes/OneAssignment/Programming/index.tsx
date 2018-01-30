import { FetchAssignmentDetail, FetchOneSubmission } from '@/api/one-assignment';
import { OneAssignmentModel } from '@/models/one-assignment.model';
import ProgrammingDescription from '@/routes/OneAssignment/Programming/Description';
import ProgrammingReport from '@/routes/OneAssignment/Programming/Report';
import ProgrammingSubmissions from '@/routes/OneAssignment/Programming/Submissions';
import ProgrammingSubmit from '@/routes/OneAssignment/Programming/Submit';
import { ProgrammingKeys } from '@/types/constants';
import { IDescriptionItem } from '@/utils/helpers';
import { Tabs } from 'antd';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { asyncAction } from 'mobx-utils';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const { TabPane } = Tabs;

export interface IProgrammingConfig {
  compilers: string[];
  limits: {
    memory: number;
    time: number;
  };
  submission: string[];
  standard_score: number;
}

export enum CheckType {
  Compile = 'compile check',
  Memory = 'memory check',
  Standard = 'standard tests',
  Static = 'static check'
}

export interface IProgrammingReport {
  'compile check': {
    'compile check': string;
    continue: boolean;
    grade: number;
  };
  'memory check': {
    continue: boolean;
    grade: number;
  };
  'standard tests': {
    continue: boolean;
    grade: number;
  };
  'static check': {
    continue: boolean;
    grade: number;
  };
}

export interface IProgrammingSubmission {
  answers: Array<{ code: string, name: string }>;
  grade: number | null;
  report: IProgrammingReport;
  sub_ca_id: number;
}

interface IProgrammingProps extends RouteComponentProps<{ course_id: string, ca_id: string }> {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
class Programming extends React.Component<IProgrammingProps> {

  @observable
  oneSubmission: IProgrammingSubmission;

  @observable
  isOneSubmissionLoaded = false;

  @asyncAction
  * LoadOneSubmission({ sub_ca_id }: { sub_ca_id: number }) {
    const { course_id, ca_id } = this.props.match.params;
    this.isOneSubmissionLoaded = false;
    try {
      const { data: { data: one } } = yield FetchOneSubmission<IProgrammingSubmission>({
        course_id: Number.parseInt(course_id),
        ca_id: Number.parseInt(ca_id),
        sub_ca_id
      });
      this.oneSubmission = one;
    } catch (error) {
      throw error;
    }
    this.isOneSubmissionLoaded = true;
  }

  onDetail = async (args: { sub_ca_id: number }) => {
    await this.LoadOneSubmission(args);
  }

  @computed
  get programmingLimits(): IDescriptionItem[] {
    const { config }: { config: IProgrammingConfig } = this.props.$OneAssignment!.assignment;
    return [
      { term: '时间限制', key: 'time-limits', icon: 'clock-circle-o', value: `${config.limits.time} ms` },
      { term: '内存限制', key: 'space-limits', icon: 'database', value: `${config.limits.memory} MBytes` }
    ];
  }

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  render() {
    return (
      <Tabs
        activeKey={ this.activeKey }
        tabBarStyle={ { display: 'none' } }
      >
        <TabPane key={ ProgrammingKeys.Description } tab={ ProgrammingKeys.Description }>
          <ProgrammingDescription/>
        </TabPane>
        <TabPane key={ ProgrammingKeys.Submit } tab={ ProgrammingKeys.Submit }>
          <ProgrammingSubmit/>
        </TabPane>
        <TabPane key={ ProgrammingKeys.GradeFeedback } tab={ ProgrammingKeys.GradeFeedback }>
          <ProgrammingReport oneSubmission={ this.oneSubmission }/>
        </TabPane>
        <TabPane key={ ProgrammingKeys.Recordings } tab={ ProgrammingKeys.Recordings }>
          <ProgrammingSubmissions onDetail={ this.onDetail }/>
        </TabPane>
      </Tabs>
    );
  }
}

export default withRouter(Programming);
