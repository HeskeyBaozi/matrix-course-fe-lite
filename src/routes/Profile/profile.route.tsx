import React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Card, Col, Row } from 'antd';
import { ProfileModel } from '@/models/profile.model';
import { UserProfileComponent, CurrentCoursesComponent } from '@/utils/dynamic';

interface ProfileRouteProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
}

@inject('$Profile')
@observer
export default class ProfileRoute extends React.Component<ProfileRouteProps> {
  componentDidMount() {
    console.log(this.props.$Profile!.profile);
  }

  render() {
    const { $Profile } = this.props;
    return (
      <Row gutter={ 16 }>
        <Col span={ 12 }>
          <UserProfileComponent />
        </Col>
        <Col span={ 12 }>
          <Row gutter={ 16 }>
            <Col span={ 24 }>
              <CurrentCoursesComponent />
            </Col>
            <Col span={ 24 }>
              123
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
