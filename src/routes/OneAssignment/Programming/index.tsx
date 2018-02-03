import { OneAssignmentModel } from '@/models/one-assignment.model';
import ProgrammingDescription from '@/routes/OneAssignment/Programming/Description';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import ProgrammingRank from '@/routes/OneAssignment/Programming/Rank';
import ProgrammingReport from '@/routes/OneAssignment/Programming/Report';
import ProgrammingStandardAnswer from '@/routes/OneAssignment/Programming/StandardAnswer';
import ProgrammingSubmissions from '@/routes/OneAssignment/Programming/Submissions';
import ProgrammingSubmit from '@/routes/OneAssignment/Programming/Submit';
import { AssignmentTimeStatus, ProgrammingKeys } from '@/types/constants';
import { Tabs } from 'antd';
import { computed, observable } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';

const { TabPane } = Tabs;

interface IProgrammingProps {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
export default class Programming extends React.Component<IProgrammingProps> {

  $$Programming = new ProgrammingModel();

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  async componentDidMount() {
    const { assignment: { course_id, ca_id, pub_answer }, timeStatus } = this.props.$OneAssignment!;
    const args = { course_id, ca_id };
    const loadList: any[] = [
      this.$$Programming.LoadLastSubmission(args),
      this.$$Programming.LoadRanks(args)
    ];
    if (pub_answer && timeStatus === AssignmentTimeStatus.OutOfDate) {
      loadList.push(this.$$Programming.LoadStandardAnswer(args));
    }
    await Promise.all(loadList);
  }

  render() {
    return (
      <Provider $$Programming={ this.$$Programming }>
        <Tabs activeKey={ this.activeKey } tabBarStyle={ { display: 'none' } }>
          <TabPane key={ ProgrammingKeys.Description } tab={ ProgrammingKeys.Description }>
            <ProgrammingDescription/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.Submit } tab={ ProgrammingKeys.Submit }>
            <ProgrammingSubmit/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.GradeFeedback } tab={ ProgrammingKeys.GradeFeedback }>
            <ProgrammingReport/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.Recordings } tab={ ProgrammingKeys.Recordings }>
            <ProgrammingSubmissions/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.Rank } tab={ ProgrammingKeys.Rank }>
            <ProgrammingRank/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.StandardAnswer } tab={ ProgrammingKeys.StandardAnswer }>
            <ProgrammingStandardAnswer/>
          </TabPane>
        </Tabs>
      </Provider>
    );
  }
}
