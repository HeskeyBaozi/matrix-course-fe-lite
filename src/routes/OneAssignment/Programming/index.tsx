import { OneAssignmentModel } from '@/models/one-assignment.model';
import ProgrammingDescription from '@/routes/OneAssignment/Programming/Description';
import { ProgrammingModel } from '@/routes/OneAssignment/Programming/model';
import ProgrammingReport from '@/routes/OneAssignment/Programming/Report';
import ProgrammingSubmissions from '@/routes/OneAssignment/Programming/Submissions';
import ProgrammingSubmit from '@/routes/OneAssignment/Programming/Submit';
import { ProgrammingKeys } from '@/types/constants';
import { Tabs } from 'antd';
import { computed, observable } from 'mobx';
import { inject, observer, Provider } from 'mobx-react';
import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

const { TabPane } = Tabs;

interface IProgrammingProps extends RouteComponentProps<{ course_id: string, ca_id: string }> {
  $OneAssignment?: OneAssignmentModel;
}

@inject('$OneAssignment')
@observer
class Programming extends React.Component<IProgrammingProps> {

  @observable
  $$Programming = new ProgrammingModel();

  @computed
  get activeKey() {
    const { $OneAssignment } = this.props;
    return $OneAssignment!.tabActiveKey;
  }

  constructor(props: any) {
    super(props);
    console.log('const', this.$$Programming);
  }

  async componentDidMount() {
    console.log('DidMount', this.$$Programming);
    const { assignment: { course_id, ca_id } } = this.props.$OneAssignment!;
    await this.$$Programming.LoadLastSubmission({
      course_id, ca_id
    });
  }

  render() {
    return (
      <Provider $$Programming={ this.$$Programming }>
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
            <ProgrammingReport/>
          </TabPane>
          <TabPane key={ ProgrammingKeys.Recordings } tab={ ProgrammingKeys.Recordings }>
            <ProgrammingSubmissions/>
          </TabPane>
        </Tabs>
      </Provider>
    );
  }
}

export default withRouter(Programming);
