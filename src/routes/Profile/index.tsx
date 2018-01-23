import React from 'react';
import { RouteComponentProps } from 'react-router';
import { observer, inject } from 'mobx-react';
import { Col, Row } from 'antd';
import { ProfileModel } from '@/models/profile.model';
import UserProfileCard from '@/components/UserProfileCard';
import CurrentCoursesCard from '@/components/CurrentCoursesCard';
import DeadlinesCard from '@/components/DeadlinesCard';
import { ColProps } from 'antd/lib/grid';

interface ProfileRouteProps extends RouteComponentProps<{}> {
  $Profile?: ProfileModel;
}

const topRightResponsive: ColProps = { xs: 24, sm: 24, md: 24, lg: 24, xl: 12 };

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
          <UserProfileCard/>
        </Col>
        <Col span={ 12 }>
          <Row gutter={ 16 }>
            <Col { ...topRightResponsive }>
              <CurrentCoursesCard/>
            </Col>
            <Col { ...topRightResponsive }>
              <DeadlinesCard/>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
